import { text } from '@clack/prompts'
import { Command } from 'commander'

import { $ } from './shared'

const noCheckBranch = new Set(['dev', 'test', 'beta', 'release', 'master'])

export const setupMerrageCommit = (program: Command) => {
  program
    .command(`merge-commit`)
    .description('合并成一条提交结点')
    .action(async () => {
      const [currentBranch, currentBranchHash, baseHash] = await Promise.all([
        $('git rev-parse --abbrev-ref HEAD'),
        $('git rev-parse HEAD'),
        $('git merge-base master HEAD'),
      ])

      if (noCheckBranch.has(currentBranch)) {
        console.log(`当前分支不能进行合并操作，禁止进行合并的分支：${[...noCheckBranch]}`)
        process.exit(0)
      }

      const waitPushFile = await $(`git status -z`)
      if (waitPushFile !== '') {
        console.log('当前Git工作区不干净，存在尚未push的文件')
        process.exit(0)
      }

      const diffCountText = await $(`git rev-list --count ${currentBranchHash}..${baseHash}`)
      const diffCount = Number(diffCountText.trim())
      if (diffCount < 2) {
        console.log('当前分支新增的commit节点 < 2，无须合并')
        process.exit(0)
      }

      const message = await text({ message: '请填写commit信息' })

      try {
        await $(`git reset ${baseHash} && git add . git commit -m ${String(message)}`)

        console.log('合并成功')
      } catch (error) {
        try {
          await $(`git reset ${currentBranchHash} --hard`)
          console.log('合并失败，回滚成功')
        } catch {
          console.log('合并失败，回滚失败')
        }
      }
    })
}
