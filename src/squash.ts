import { cancel, isCancel, log, text } from '@clack/prompts'
import { Command } from 'commander'
import { inc } from 'semver'

import { $, introBanner, outroBanner, s } from './shared'

const noCheckBranch = new Set(['dev', 'test', 'beta', 'release', 'master'])

export const setupSquash = (program: Command) => {
  program
    .command(`squash`)
    .option('-im, --into-master', '压缩完成后，直接合入master', false)
    .option('-imt, --into-master-tag', '压缩完成后，直接合入master，并打上tag推送', false)
    .description('自动化合入基准分支操作')
    .action(async options => {
      introBanner('Squash 任务开始')

      s.start('进行分支检测')

      const [currentBranch, currentBranchHash, baseHash] = await Promise.all([
        $('git rev-parse --abbrev-ref HEAD'),
        $('git rev-parse HEAD'),
        $('git merge-base master HEAD'),
      ])

      if (noCheckBranch.has(currentBranch)) {
        log.warn('当前分支不能进行压缩操作')
        process.exit(0)
      }

      const waitPushFile = await $(`git status -z`)
      if (waitPushFile !== '') {
        log.error('当前存在尚未push的文件')
        process.exit(0)
      }

      const diffCountText = await $(`git rev-list --count ${baseHash}..${currentBranchHash}`)
      const diffCount = Number(diffCountText)
      if (diffCount < 2) {
        log.info('当前分支新增的commit节点<2，无须压缩')
        process.exit(0)
      }

      s.stop('分支检测完成')

      const message = await text({ message: '请填写commit信息' })
      if (isCancel(message)) {
        cancel('操作取消')
        process.exit(0)
      }

      try {
        await $(`git reset ${baseHash} && git add . && git commit -m "${message}"`)

        if (options.intoMaster || options.intoMasterTag) {
          s.start('合并入master分支')
          await $(`git fetch && git switch master && git fetch origin master && git reset origin/master --hard`)
          s.stop('合并入master完成')
        }

        if (options.intoMasterTag) {
          try {
            // 打tag
            s.start('更新并推送Tag')
            const currentTag = await $(`git describe --tags --abbrev=0`)
            const recommendTag = inc(currentTag.trim(), 'patch')
            await $(`git tag ${recommendTag} && git push origin v${recommendTag}`)
            s.stop('更新并推送Tag完成')
          } catch {
            // something
          }
        }

        outroBanner('Squash 任务结束')
      } catch (error) {
        try {
          await $(`git reset ${currentBranchHash} --hard`)
          log.info('压缩失败，回滚成功')
        } catch {
          log.error('压缩失败，回滚失败')
        } finally {
          outroBanner('压缩结束')
        }
      }
    })
}
