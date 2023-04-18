export const TYPE_MAP = new Map([
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

const commitRegText = `^(${[...TYPE_MAP.values()]
  .map(({ title, emoji }) => `${title}|${emoji} ${title}`)
  .join('|')})(\\(.+\\))?: .{1,100}`

export const commitReg = new RegExp(commitRegText)

export const FIX_BRANCH = new Set(['master', 'pre', 'release', 'beta', 'test', 'dev'])

export const branchNameReg = /^(feature|hotfix)\/(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])-(\d+|\w+(-\w+)?)$/g
