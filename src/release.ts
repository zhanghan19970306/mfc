import { cancel, confirm, isCancel, log, note, select } from '@clack/prompts'
import { Command } from 'commander'
import { inc } from 'semver'

import { $, introBanner, outroBanner, s } from './shared'

type AllowBranch = 'beta' | 'master'
const allowBranch = new Set(['beta', 'master'])

const checkBranch = (branch: string): branch is AllowBranch => allowBranch.has(branch)

export const setupRelease = (program: Command) => {
  program
    .command(`release`)
    .description('当前项目下，发布版本')
    .option('-cs, --create-changelog', '是否生成changelog文件', false)
    .option('-sf, --send-feishu', '是否推送飞书群', false)
    .action(async options => {
      introBanner('release 任务开始')
      s.start('进行分支检测')
      const { npm_package_version } = process.env
      if (!npm_package_version) {
        log.error(`当前分支下未找到正确的版本号`)
        process.exit(1)
      }

      const branch = await $('git rev-parse --abbrev-ref HEAD')
      if (!checkBranch(branch)) {
        log.error(`当前分支不允许进行发布操作\n可发布分支为：${[...allowBranch]}`)
        process.exit(1)
      }

      await $(`git fetch origin ${branch}`)
      const diffContent = await $(`git log ${branch}..origin/${branch}`)
      if (diffContent !== '') {
        log.error(`远程${branch}分支存在新的commit，请先拉取`)
        process.exit(1)
      }
      s.stop('分支检测完毕')

      note(`当前分支名：${branch}\n当前版本号：${npm_package_version}`)

      let selectOptions = []
      switch (branch) {
        case 'beta':
          selectOptions = [
            {
              value: `${inc(npm_package_version, 'premajor')}`,
              label: 'premajor - 升级主版本号',
              hint: `升级为${inc(npm_package_version, 'premajor')}`,
            },
            {
              value: `${inc(npm_package_version, 'preminor')}`,
              label: 'preminor - 升级次版本号',
              hint: `升级为${inc(npm_package_version, 'preminor')}`,
            },
            {
              value: `${inc(npm_package_version, 'prepatch')}`,
              label: 'prepatch - 升级修订号',
              hint: `升级为${inc(npm_package_version, 'prepatch')}`,
            },
          ]
          break

        case 'master':
          selectOptions = [
            {
              value: `${inc(npm_package_version, 'major')}`,
              label: 'major - 升级主版本号',
              hint: `升级为${inc(npm_package_version, 'major')}`,
            },
            {
              value: `${inc(npm_package_version, 'minor')}`,
              label: 'minor - 升级次版本号',
              hint: `升级为${inc(npm_package_version, 'minor')}`,
            },
            {
              value: `${inc(npm_package_version, 'patch')}`,
              label: 'patch - 升级修订号',
              hint: `升级为${inc(npm_package_version, 'patch')}`,
            },
          ]
          break
        default:
          throw new Error('没有找到该固定分支')
      }

      const version = await select({
        message: '选择要升级的版本',
        options: selectOptions,
        initialValue: '0.1.3',
      })

      if (isCancel(version)) {
        cancel('操作取消')
        process.exit(0)
      }

      const shouldContinue = await confirm({ message: `发布v${version}版本，确定吗?` })

      if (isCancel(shouldContinue) || shouldContinue === false) {
        cancel('操作取消')
        process.exit(0)
      }

      if (options.createChangelog) {
        s.start('生成changelog')
        // TODO: 接入changlog生成器
        s.stop('生成成功')
      }

      if (options.sendFeishu) {
        // TODO: 接入飞书
      }

      s.start('升级version')
      await $(`npm version v${version} --no-git-tag-version && git add -A && git commit -m "release: v${version}"`)
      s.stop('升级version完毕')

      s.start('生成并推送Tag')
      await $(`git tag v${version} && git push origin v${version}`)
      s.stop('生成并推送Tag完毕')

      // introBanner()
      outroBanner('release 任务结束')
    })
}
