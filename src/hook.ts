import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { Command } from 'commander'
import { inc } from 'semver'

import {
  $,
  branchNameReg,
  commitReg,
  errorBox,
  FIX_BRANCH,
  introBanner,
  outroBanner,
  runAsyncScript,
  s,
  TYPE_MAP,
  warnBox,
} from './shared'

type HooksName = 'commit-msg' | 'prepare-commit-msg' | 'post-checkout' | 'post-merge' | 'pre-commit'

export const setupHook = (program: Command) => {
  program
    .command(`hook <name>`)
    .description('执行Git hooks相关脚本')
    .action(async (hookName: HooksName) => {
      switch (hookName) {
        case 'pre-commit':
          {
            introBanner('开始进行代码检测')

            await runAsyncScript(async () => {
              s.start('开始进行ls-lint检测')
              await $(`pnpm exec ls-lint`)
              s.stop('ls-lint检测完毕')
            })

            // 进行tsc --noEmit

            await $(`pnpm exec lint-staged`)

            outroBanner('代码检测完成')
          }
          break

        case 'prepare-commit-msg':
          {
            const isMerging = existsSync('.git/MERGE_MSG') && existsSync('.git/MERGE_HEAD')
            if (!isMerging) process.exit(0)

            const currentBranch = await $(`git rev-parse --abbrev-ref HEAD`)
            if (currentBranch !== 'master') process.exit(0)

            const mergeMsg = readFileSync('.git/MERGE_MSG', 'utf-8').trim()
            const hasConflicts = /\n# Conflicts:\n/.test(mergeMsg)
            if (hasConflicts) {
              errorBox(
                `此次合并含有Conflicts解决后的merge节点, 不符合规范!\n查看更多：https://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#BmKOd2Q8eow08sxo7EvcacFBnaf`
              )
              process.exit(1)
            }

            const mergeHeadSha = readFileSync('.git/MERGE_HEAD', 'utf-8').trim()
            const diffCountText = await $(`git rev-list --count master..${mergeHeadSha}`)
            const diffCount = Number(diffCountText)
            if (diffCount > 1) {
              errorBox(
                ` 此次合并含${diffCount}条Commit差异, 不符合规范!\n查看更多：https://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#BmKOd2Q8eow08sxo7EvcacFBnaf`
              )
              process.exit(1)
            }
          }
          break

        case 'commit-msg':
          {
            // msg path
            const msgPath = resolve('.git/COMMIT_EDITMSG')
            const msg = readFileSync(msgPath, 'utf-8').replace(/\n#.*/g, '').trim()

            // is git merge create info
            if (/Merge.+branch '.+'/.test(msg)) {
              writeFileSync(msgPath, `🔀 ${msg.replace('Merge', 'merge:')}`)
              process.exit(0)
            }
            // lint
            if (!commitReg.test(msg)) {
              errorBox(
                `本次commit message不符合规范！\n查看更多：https://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe`
              )
              process.exit(1)
            }
            // add emoji in before
            for (const [key, { emoji }] of TYPE_MAP) {
              if (msg.startsWith(key)) {
                writeFileSync(msgPath, `${emoji} ${msg}`)
                break
              }
            }
            process.exit(0)
          }
          break

        case 'post-merge':
          {
            const currentBranch = await $(`git rev-parse --abbrev-ref HEAD`)
            if (currentBranch !== 'master') process.exit(0)

            const targetBranch = await $(`git reflog -1`).then(stdout => /@\{\d+\}: merge (.*):/.exec(stdout)?.[1])
            if (!targetBranch) process.exit(0)

            const diffCountText = await $(`git rev-list --count origin/master..master`)
            const diffCount = Number(diffCountText)

            if (diffCount > 1) {
              errorBox(
                ` 此次合并含${diffCount}条Commit差异, 不符合规范!\n查看更多：https://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#BmKOd2Q8eow08sxo7EvcacFBnaf`
              )
              await $(`git fetch origin master && git reset origin/master --hard`)
            } else {
              try {
                const currentTag = await $(`git describe --tags --abbrev=0`)
                const recommendTag = inc(currentTag.trim(), 'patch')
                console.log(
                  `${[
                    '\x1B[34m\x1B[39m\n' +
                      '\x1B[34m╔ info ═══════════════════════════════════════════════╗\x1B[39m\n' +
                      `\x1B[34m║\x1B[39m 检测到当前最新的Tag为：${currentTag} 推荐更新为 ==> \x1B[1mv\x1B[32m${recommendTag}\x1B[39m\x1B[22m \x1B[34m║\x1B[39m\n` +
                      `\x1B[34m║\x1B[39m 一键更新:\x1B[1m\x1B[34mgit tag v${recommendTag} && git push origin v${recommendTag}\x1B[39m\x1B[22m   \x1B[34m║\x1B[39m\n` +
                      '\x1B[34m╚═════════════════════════════════════════════════════╝\x1B[39m\n' +
                      '\x1B[34m\x1B[39m',
                  ]}`
                )
              } catch {
                //
              }
            }
          }
          break

        case 'post-checkout':
          {
            const lastlog = await $(`git reflog -1`)
            const [, prevBranch, currentBranch] = lastlog.match(/moving from (.+) to (.+)/) ?? []
            if (!prevBranch || !currentBranch || FIX_BRANCH.has(currentBranch)) process.exit(0)

            const diffContent = await $(`git diff ${currentBranch} ${prevBranch}`)
            if (diffContent !== '') process.exit(0)

            if (prevBranch !== 'master') {
              warnBox(
                '非master分支禁止迁出分支!\n查看更多：https://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#U0eCdwuIgoceIqxKO5Hc6YS0nFg'
              )
            }

            if (!branchNameReg.test(currentBranch)) {
              warnBox(
                '当前迁出的分支名称不符合规范！\n查看更多：https://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#LiQSd86yQo6U6QxWmwacoXCjnig'
              )
            }
          }
          break

        default:
          break
      }
    })
}
