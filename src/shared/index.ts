import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { intro, log, outro } from '@clack/prompts'
import chalk from 'chalk'

const promisifyExec = promisify(exec)

const pipe = (...funs: ((...arg: any[]) => unknown)[]) => {
  if (funs.length === 0) return (...arg: any[]) => arg
  if (funs.length === 1) return funs[0]
  return funs.reduce(
    (a, b) =>
      (...args: any[]) =>
        b(a(...args))
  )
}

export const $ = (command: string) => promisifyExec(command).then(({ stdout }) => stdout.trim())

export const runAsyncScript = async (fn: (...arg: unknown[]) => Promise<void>) => {
  try {
    await fn()
  } catch (error) {
    log.error((error as { stdout: string }).stdout || (error as Error).message)
    process.exit(1)
  }
}

export const introBanner = pipe(chalk.bold, chalk.bgBlueBright, intro)

export const outroBanner = pipe(chalk.bold, chalk.bgGreenBright, outro)
