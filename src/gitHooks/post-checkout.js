import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const $ = promisify(exec)

const fixBranch = new Set(['master', 'pre', 'release', 'beta', 'test', 'dev'])

const lastlog = await $(`git reflog -1`).then(({ stdout }) => stdout.trim())
const regResult = lastlog.match(/moving from (.+) to (.+)/) ?? []
const prevBranch = regResult.at(1)
const currentBranch = regResult.at(2)
if (!prevBranch || !currentBranch || fixBranch.has(currentBranch)) process.exit(0)

const diffContent = await $(`git diff ${currentBranch} ${prevBranch}`).then(({ stdout }) => stdout.trim())
if (diffContent === '') {
  if (prevBranch !== 'master') {
    console.log(
      `${[
        '\x1B[33m\x1B[39m\n' +
          '\x1B[33m╔ warning ══════════════════════════════════════════════════════════════════════════════════════════╗\x1B[39m\n' +
          '\x1B[33m║\x1B[39m 非master分支禁止迁出分支!                                                                         \x1B[33m║\x1B[39m\n' +
          '\x1B[33m║\x1B[39m 查看更多:\x1B[34mhttps://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#U0eCdwuIgoceIqxKO5Hc6YS0nFg\x1B[39m \x1B[33m║\x1B[39m\n' +
          '\x1B[33m╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝\x1B[39m\n' +
          '\x1B[33m\x1B[39m',
      ]}`
    )
  }

  const branchNameReg = /^(feature|hotfix)\/(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])-(\d+|\w+(-\w+)?)$/g
  if (!branchNameReg.test(currentBranch)) {
    console.log(
      `${[
        '\x1B[33m\x1B[39m\n' +
          '\x1B[33m╔ warning ══════════════════════════════════════════════════════════════════════════════════════════╗\x1B[39m\n' +
          '\x1B[33m║\x1B[39m 当前迁出的分支名称不符合规范！                                                                    \x1B[33m║\x1B[39m\n' +
          '\x1B[33m║\x1B[39m 查看更多:\x1B[34mhttps://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#LiQSd86yQo6U6QxWmwacoXCjnig\x1B[39m \x1B[33m║\x1B[39m\n' +
          '\x1B[33m╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝\x1B[39m\n' +
          '\x1B[33m\x1B[39m',
      ]}`
    )
  }
}
