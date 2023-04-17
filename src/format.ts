import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { intro, log, outro, spinner } from '@clack/prompts'
import chalk from 'chalk'
import { Command } from 'commander'

const $ = promisify(exec)
const s = spinner()

const runAsyncScript = async (fn: (...arg: unknown[]) => Promise<void>) => {
  try {
    await fn()
  } catch (error) {
    log.error((error as { stdout: string }).stdout || (error as Error).message)
    process.exit(1)
  }
}

const pipe = (...funs: ((...arg: any[]) => unknown)[]) => {
  if (funs.length === 0) return (...arg: any[]) => arg
  if (funs.length === 1) return funs[0]
  return funs.reduce(
    (a, b) =>
      (...args: any[]) =>
        b(a(...args))
  )
}

const introBanner = pipe(chalk.bold, chalk.bgBlueBright, intro)
const outroBanner = pipe(chalk.bold, chalk.bgGreenBright, outro)

export const setupFormat = (program: Command) => {
  program
    .command(`format`)
    .description('格式化/修复代码，使其符合指定的规范')
    .option('-sll, --skip-ls-lint', '跳过ls-lint检测', false)
    .option('-stt, --skip-ts-type', '跳过ts-type检测', false)
    .option('-sp, --skip-prettier', '跳过prettier检测', false)
    .option('-se, --skip-eslint', '跳过eslint检测', false)
    .option('-ss, --skip-stylelint', '跳过stylelint检测', false)
    .action(async options => {
      introBanner(' 开始进行代码修复/格式化 ')

      await runAsyncScript(async () => {
        if (options.skipLs) return

        s.start('开始进行ls-lint检测')
        await $(`pnpm exec ls-lint`)
        s.stop('ls-lint检测通过')
      })

      await runAsyncScript(async () => {
        if (options.skipTs) return

        s.start('开始进行ts-type检测')
        await $(`tsc --noEmit`)
        s.stop('ts-type检测通过')
      })

      await runAsyncScript(async () => {
        if (options.skipPrettier) return

        s.start('开始进行prettier修复')
        await $(`prettier --cache --list-different --write .`)
        s.stop('prettier修复完成')
      })

      await runAsyncScript(async () => {
        if (options.skipEslint) return

        s.start('开始进行eslint修复')
        await $(`eslint --ext .vue,.js,.ts,jsx,.tsx,.mpx --fix --format unix .`)
        s.stop('eslint修复完成')
      })

      await runAsyncScript(async () => {
        if (options.skipStylelint) return

        s.start('开始进行stylelint修复')
        await $(`stylelint ./src/**/*.{css,scss,less,vue,.mpx} --fix --aei --formatter unix`)
        s.stop('stylelint修复完成')
      })

      outroBanner(' 代码修复/格式化完成 ')
    })
}
