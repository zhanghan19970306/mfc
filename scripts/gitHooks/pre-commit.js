import { $ } from 'execa'
import { intro, outro, spinner, isCancel, cancel, text, log } from '@clack/prompts'

intro('开始进行代码检测')

const s = spinner()

{
  s.start('开始进行ls-lint检测')
  const { stdout } = await $`ls-lint --warn`
  s.stop('ls-lint检测完毕')
  if (stdout.trim()) {
    log.error(stdout)
    process.exit(1)
  }
}

s.start('开始进行eslint检测')
s.stop('eslint检测完毕')

s.start('开始进行stylelint检测')
s.stop('stylelint检测完毕')

outro('代码检测完成')
