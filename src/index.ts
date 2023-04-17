import { Command } from 'commander'

import { version } from '../package.json'
import { setupCreate } from './create'
import { setupFormat } from './format'
import { setupMerrageCommit } from './merge-commit'

// 实例化
const program = new Command('Pandora')

// 移除默认自带 help子命令
program.addHelpCommand(false)
// 覆盖默认的version描述 以及设置当前CLI的版本
program.version(version, '-v, --version', 'CLI的当前版本')
// 覆盖默认的help描述
program.helpOption('-h, --help', '查看帮助')

// 创建子命令
setupCreate(program)
setupFormat(program)
setupMerrageCommit(program)

// 最后进行解析参数
program.parse(process.argv)
