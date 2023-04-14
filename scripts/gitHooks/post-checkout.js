import { promisify } from 'node:util'
import { exec } from 'node:child_process'

const $ = promisify(exec)

const currentBranch = await $('git rev-parse --abbrev-ref HEAD').then(({ stdout }) => stdout.trim())
const fixedBranchs = ['master', 'pre', 'release', 'beta', 'test', 'dev']
if (fixedBranchs.includes(currentBranch)) process.exit(0)
const branchNameReg = /^(feature|hotfix)\/(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\-(\d+|\w+(-\w+)?)$/g
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
