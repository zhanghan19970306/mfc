import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts'
import { Command } from 'commander'
// const s = spinner()

export const setupCreate = (program: Command) => {
  program
    .command(`create [name]`)
    .description('创建一个项目')
    .option('-r, --force', '强制创建')
    .action(async (initialName?: string) => {
      intro('开始创建')

      const name = await text({
        message: '项目名称',
        placeholder: '好名字是一个美好的开始',
        initialValue: initialName,
        validate(value) {
          if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/g.test(value)) {
            return '项目名称不符合规范'
          }
        },
      })

      if (isCancel(name)) {
        cancel('操作取消')
        process.exit(0)
      }

      const type = await select({
        message: '选择项目的类型',
        options: [
          { value: 'vue2-web', label: 'vue2-web', hint: '这里是hint' },
          { value: 'vue3-web', label: 'vue3-web', hint: '这里是hint' },
          { value: 'vue3-h5', label: 'vue3-h5', hint: '这里是hint' },
          { value: 'Lib', label: 'Lib', hint: '这里是hint' },
        ],
      })

      if (isCancel(type)) {
        cancel('操作取消')
        process.exit(0)
      }

      outro('创建完成')
    })
}
