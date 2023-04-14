import { existsSync, readFileSync } from 'node:fs'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'

const $ = promisify(exec)

const isMerging = existsSync('.git/MERGE_MSG') && existsSync('.git/MERGE_HEAD')
if (!isMerging) process.exit(0)

const { stdout: currentBranch } = await $(`git rev-parse --abbrev-ref HEAD`)
if (currentBranch.trim() !== 'master') process.exit(0)

const mergeMsg = readFileSync('.git/MERGE_MSG', 'utf-8').trim()
const hasConflicts = /\n# Conflicts:\n/.test(mergeMsg)
if (hasConflicts) {
  console.log(
    `${[
      '\x1B[31m\x1B[39m\n' +
        '\x1B[31m╔ error ════════════════════════════════════════════════════════════════════════════════════════════╗\x1B[39m\n' +
        '\x1B[31m║\x1B[39m 此次合并含有Conflicts解决后的merge节点, 不符合规范！                                              \x1B[31m║\x1B[39m\n' +
        '\x1B[31m║\x1B[39m 查看更多:\x1B[34mhttps://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#BmKOd2Q8eow08sxo7EvcacFBnaf\x1B[39m \x1B[31m║\x1B[39m\n' +
        '\x1B[31m╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝\x1B[39m\n' +
        '\x1B[31m\x1B[39m',
    ]}`
  )
  process.exit(1)
}

const mergeHeadSha = readFileSync('.git/MERGE_HEAD', 'utf-8').trim()
const { stdout: diffCountText } = await $(`git rev-list --count master..${mergeHeadSha}`)
const diffCount = Number(diffCountText.trim())
if (diffCount > 1) {
  console.log(
    `${[
      '\x1B[31m\x1B[39m\n' +
        '\x1B[31m╔ error ════════════════════════════════════════════════════════════════════════════════════════════╗\x1B[39m\n' +
        '\x1B[31m║\x1B[39m 此次合并含' +
        diffCount +
        '条Commit差异, 不符合规范！                                                             \x1B[31m║\x1B[39m\n' +
        '\x1B[31m║\x1B[39m 查看更多:\x1B[34mhttps://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe#BmKOd2Q8eow08sxo7EvcacFBnaf\x1B[39m \x1B[31m║\x1B[39m\n' +
        '\x1B[31m╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝\x1B[39m\n' +
        '\x1B[31m\x1B[39m',
    ]}`
  )
  process.exit(1)
}
