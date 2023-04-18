import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { intro, log, outro, spinner } from '@clack/prompts'
import boxen from 'boxen'
import chalk from 'chalk'

const boxenBaseOptions = {
  margin: { top: 1, bottom: 1 },
  padding: { left: 1, right: 1 },
  borderStyle: 'double',
} as const

const pipe = (...funs: ((...arg: any[]) => unknown)[]) => {
  if (funs.length === 0) return (...arg: any[]) => arg
  if (funs.length === 1) return funs[0]
  return funs.reduce(
    (a, b) =>
      (...args: any[]) =>
        b(a(...args))
  )
}

const promisifyExec = promisify(exec)

export const s = spinner()

export const $ = (command: string) => promisifyExec(command).then(({ stdout }) => stdout.trim())

export const runAsyncScript = async (fn: (...arg: unknown[]) => Promise<void>) => {
  try {
    await fn()
  } catch (error) {
    log.error((error as { stdout: string }).stdout || (error as Error).message)
    process.exit(1)
  }
}

export const addSpace = (str: string) => ` ${str} `

export const introBanner = pipe(addSpace, chalk.bold, chalk.bgBlueBright, intro)

export const outroBanner = pipe(addSpace, chalk.bold, chalk.bgGreenBright, outro)

export const linkStyle = chalk.blue

export const successBox = (text: string) =>
  console.log(boxen(text, { title: `success`, borderColor: 'green', ...boxenBaseOptions }))

export const infoBox = (text: string) =>
  console.log(boxen(text, { title: `info`, borderColor: 'blue', ...boxenBaseOptions }))

export const warnBox = (text: string) =>
  console.log(boxen(text, { title: `warning`, borderColor: 'yellow', ...boxenBaseOptions }))

export const errorBox = (text: string) =>
  console.log(boxen(text, { title: `error`, borderColor: 'red', ...boxenBaseOptions }))
