// prettier config for vue project
module.exports = {
  // 换行最大值
  printWidth: 120,
  // 缩进字节数
  tabWidth: 2,
  // 是否使用tab来进行缩进
  useTabs: false,
  // 句尾是否添加分号
  semi: false,
  // 是否使用单引号代替双引号
  singleQuote: true,
  // 如果对象中至少有一个属性需要引号，则所有属性都加上引号。
  quoteProps: 'consistent',
  // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  arrowParens: 'avoid',
  // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  trailingComma: 'es5',
  // 是否在对象，数组括号与文字之间加空格 "{ foo: bar }"
  bracketSpacing: true,
  // 不把'>' 单独放在新一行
  bracketSameLine: false,
  // 结尾是auto  '\n' '\r' '\n\r'
  endOfLine: 'auto',
}
