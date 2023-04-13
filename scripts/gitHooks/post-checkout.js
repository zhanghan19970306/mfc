import { $ } from 'execa'

const { stdout: currentBranch } = await $`git rev-parse --abbrev-ref HEAD`

console.log`post-checkout ==> 当前分支名称: ${currentBranch}`
