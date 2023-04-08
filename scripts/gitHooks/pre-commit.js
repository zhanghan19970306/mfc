import { $ } from 'execa'
import { intro, outro, confirm, select, spinner, isCancel, cancel, text } from '@clack/prompts'

console.log(123)

intro('即将开始进行代码检测')

const s = spinner()
s.start('检测目录/文件的正确命名')
await $`ls-lint --warn`
s.stop('检测目录/文件的正确命名')

process.exit(1)
