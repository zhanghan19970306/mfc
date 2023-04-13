import { existsSync, readFileSync } from 'node:fs'
import { $ } from 'execa'
import { log } from 'node:console'

console.log('prepare-commit-msg')

const isMerging = existsSync('.git/MERGE_MSG') && existsSync('.git/MERGE_HEAD')
if (!isMerging) process.exit(0)

const { stdout: currentBranch } = await $`git rev-parse --abbrev-ref HEAD`
if (currentBranch.trim() !== 'master') process.exit(0)

const mergeMsg = readFileSync('.git/MERGE_MSG', 'utf-8').trim()
const hasConflicts = /\n# Conflicts:\n/.test(mergeMsg)
if (hasConflicts) {
  console.log('此次合并含有Conflicts解决后的merge节点, 不符合规范！')
  process.exit(1)
}

const mergeHeadSha = readFileSync('.git/MERGE_HEAD', 'utf-8').trim()
const { stdout: diffCountText } = await $`git rev-list --count master..${mergeHeadSha}`
const diffCount = Number(diffCountText.trim())

log(diffCount)
if (diffCount > 1) {
  console.log(`此次合并含${diffCount}条Commit差异, 不符合规范！`)
  process.exit(1)
}
