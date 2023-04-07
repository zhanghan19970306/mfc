import { default as boxen } from 'boxen'
import { type } from 'os'

process.env.FORCE_COLOR = type() === 'Darwin' ? 3 : 2

const baseOptions = {
  margin: { top: 1, bottom: 1 },
  padding: { left: 1, right: 1 },
  borderStyle: 'double',
}

export const errorBoxen = text => console.log(`${boxen(text, { title: 'error', borderColor: 'red', ...baseOptions })}`)
