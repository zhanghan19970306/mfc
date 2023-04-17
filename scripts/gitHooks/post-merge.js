import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { inc } from 'semver'

const $ = promisify(exec)

const { stdout: currentBranch } = await $(`git rev-parse --abbrev-ref HEAD`)
if (currentBranch.trim() !== 'master') process.exit(0)

// 获取合并进来的分支名
const targetBranch = await $(`git reflog -1`).then(({ stdout }) => /@\{\d+\}: merge (.*):/.exec(stdout.trim())?.[1])
// 如果不存合并分支 直接成功退出该脚本
if (!targetBranch) process.exit(0)

const { stdout: diffCountText } = await $(`git rev-list --count origin/master..master`)
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
  await $(`git fetch origin master`)
  await $(`git reset --hard origin/master`)
} else {
  try {
    const { stdout: currentTag } = await $(`git describe --tags --abbrev=0`)
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
  } catch (error) {
    console.log(error)
  }
}
