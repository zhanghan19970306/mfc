import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { intro, log, outro, spinner } from '@clack/prompts'

const $ = promisify(exec)

intro('开始进行代码检测')

const s = spinner()

{
  s.start('开始进行ls-lint检测')
  const { stdout } = await $(`pnpm exec ls-lint --warn`)
  s.stop('ls-lint检测完毕')
  if (stdout.trim()) {
    log.error(stdout)
    process.exit(1)
  }
}

s.start('开始进行prettier检测')
s.stop('prettier检测完毕')

s.start('开始进行eslint检测')
s.stop('eslint检测完毕')

s.start('开始进行stylelint检测')
s.stop('stylelint检测完毕')

s.start('开始进行TS-type检测')
s.stop('TS-type检测完毕')

outro('代码检测完成')
