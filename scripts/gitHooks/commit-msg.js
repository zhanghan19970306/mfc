import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const TYPE_MAP = new Map([
  ['feat', { emoji: '✨', title: 'feat', description: '新的特性' }],
  ['fix', { emoji: '🐛', title: 'fix', description: '修复Bug' }],
  ['perf', { emoji: '🚀', title: 'perf', description: '优化' }],
  ['style', { emoji: '🎨', title: 'style', description: '代码格式的更改' }],
  ['test', { emoji: '✅', title: 'test', description: '添加或更新测试用例' }],
  ['build', { emoji: '📦', title: 'build', description: '打包工具的更改' }],
  ['chore', { emoji: '🔧', title: 'chore', description: '更改配置文件' }],
  ['ci', { emoji: '👷', title: 'ci', description: '对CI配置和脚本的更改' }],
  ['refactor', { emoji: '💻', title: 'refactor', description: '代码进行重构' }],
  ['docs', { emoji: '📝', title: 'docs', description: '添加或更新文档' }],
  ['release', { emoji: '🔖', title: 'release', description: '发布/版本标签' }],
  ['revert', { emoji: '⏪️', title: 'revert', description: '版本回退' }],
  ['merge', { emoji: '🔀', title: 'merge', description: '分支合并' }],
  ['workflow', { emoji: '🔌', title: 'workflow', description: '工作流相关' }],
  ['dx', { emoji: '🎛', title: 'dx', description: '开发者体验' }],
  ['types', { emoji: '🦾', title: 'types', description: '类型相关' }],
  ['wip', { emoji: '🔋', title: 'wip', description: '尚未开发完毕' }],
  ['init', { emoji: '🔥', title: 'init', description: '项目初始化' }],
])

// commit regexp text
const commitRegText = `^(${[...TYPE_MAP.values()]
  .map(({ title, emoji }) => `${title}|${emoji} ${title}`)
  .join('|')})(\\(.+\\))?: .{1,100}`

// create regexp
const commitRE = new RegExp(commitRegText)

// msg path
const msgPath = resolve('.git/COMMIT_EDITMSG')

// get commit text && remove all notes
const msg = readFileSync(msgPath, 'utf-8').replace(/\n#.*/g, '').trim()

// is git merge create info
if (/Merge.+branch \'.+\'/.test(msg)) {
  writeFileSync(msgPath, `🔀 ${msg.replace('Merge', 'merge:')}`)
  process.exit(0)
}

// core lint
if (!commitRE.test(msg)) {
  console.log(
    `${[
      '\x1B[31m\x1B[39m\n' +
        '\x1B[31m╔ error ════════════════════════════════════════════════════════════════╗\x1B[39m\n' +
        '\x1B[31m║\x1B[39m 本次commit message不符合规范！                                        \x1B[31m║\x1B[39m\n' +
        '\x1B[31m║\x1B[39m 查看更多:\x1B[34mhttps://qimaitech.feishu.cn/wiki/wikcnSOiZCoGVJ2AQ31c48MCaIe\x1B[39m \x1B[31m║\x1B[39m\n' +
        '\x1B[31m╚═══════════════════════════════════════════════════════════════════════╝\x1B[39m\n' +
        '\x1B[31m\x1B[39m',
    ]}`
  )
  process.exit(1)
}

// add emoji in before
for (const [key, { emoji }] of TYPE_MAP) {
  if (msg.startsWith(key)) {
    writeFileSync(msgPath, `${emoji} ${msg}`)
    break
  }
}
