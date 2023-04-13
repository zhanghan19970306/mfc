import { inc } from 'semver'
import { $ } from 'execa'
import { readFileSync, existsSync } from 'node:fs'

console.log('post-merge')

const { stdout: currentBranch } = await $`git rev-parse --abbrev-ref HEAD`
if (currentBranch.trim() !== 'master') process.exit(0)

const hasMergeNode = existsSync('.git/MERGE_HEAD')
if (!hasMergeNode) process.exit(0)

const mergeHeadSha = readFileSync('.git/MERGE_HEAD', 'utf-8').trim()
const { stdout: diffCountText } = await $`git rev-list --count master..${mergeHeadSha}`
const diffCount = Number(diffCountText.trim())

if (diffCount > 1) {
  await $`git fetch origin master && git reset --hard origin/master`
  console.log(`此次合并含${diffCount}条Commit差异, 不符合规范！`)
} else {
  const { stdout: currentTag } = await $`git describe --tags \`git rev-list --tags --max-count=1\``
  const recommendTag = inc(currentTag.trim(), 'patch')
  console.log(
    `检测到当前最新的Tag为：${currentTag} 推荐更新为 ==> ${recommendTag}\n一键更新：git tag v${recommendTag} && git push origin v${recommendTag}`
  )
}
