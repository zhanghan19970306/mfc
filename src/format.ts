import { Command } from 'commander'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import { intro, outro, spinner, isCancel, cancel, text, log } from '@clack/prompts'

const $ = promisify(exec)
const s = spinner()

export const setupFormat = (program: Command) => {
  program
    .command(`format`)
    .description('格式化/修复代码，使其符合指定的规范')
    .action(async () => {
      intro('开始进行代码修复/格式化')

      try {
        s.start('开始进行ls-lint检测')
        await $(`pnpm exec ls-lint`)
        s.stop('ls-lint检测完毕')
      } catch (error) {
        log.error(error?.message)
        process.exit(1)
      }

      // try {
      //   s.start('开始进行Type检测')
      //   await $(`tsc --noEmit`)
      //   s.stop('Type检测通过')
      // } catch (error) {
      //   log.error(error?.stdout || error?.message)
      //   process.exit(1)
      // }

      try {
        s.start('开始进行prettier修复')
        await $(`prettier --cache --list-different --write .`)
        s.stop('prettier修复完成')
      } catch (error) {
        log.error(error?.message)
        process.exit(1)
      }

      try {
        s.start('开始进行eslint修复')
        await $(`eslint --ext .vue,.js,.ts,jsx,.tsx,.mpx --fix --format unix ./src`)
        s.stop('eslint修复完成')
      } catch (error) {
        log.error(error?.stdout || error?.message)
        process.exit(1)
      }

      outro('代码修复/格式化完成')
    })
}
