module.exports = {
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-config-html',
    'stylelint-config-recommended-vue',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    /**
     * 和js文件保持统一 都要求明确文件名
     * @desc 导入文件时的规则
     */
    'scss/at-import-partial-extension': 'always',

    /**
     * 实际上我们经常会这么写 所以忽略
     * @desc 禁止低优先级的选择器出现在高优先级的选择器之后
     */
    'no-descending-specificity': null,

    /**
     * element-ui的font和iconfont的就不会包含通用系列 所以忽略
     * @desc 字体系列包含通用系列关键字
     */
    'font-family-no-missing-generic-family-keyword': null,

    /**
     * 我们更多的使用scss语法 所以我们需要忽略掉scss部分语法
     * @desc 通常的css语法规则
     */
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'return',
          'include',
          'extend',
          'mixin',
          'else',
          'while',
          'for',
          'each',
          'use',
          'forward',
        ],
      },
    ],

    /**
     * 针对于scss里面 export导出给js用会造成误判 所以我们忽略export
     * @desc 不允许未知的伪类选择器
     */
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'v-deep', 'deep'],
      },
    ],

    /**
     * 针对于浏览器前缀头 会造成误判
     * @desc 不允许未知的scss 函数
     */
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          'from',
          'to',
          'color-stop',
          '/^-webkit-gradient/',
          '/^-o-gradient/',
          '/^-moz-gradient/',
          '/^-ms-gradient/',
          'extend',
        ],
      },
    ],

    /**
     * 针对于vue css deep语法会有误判
     * @desc 不允许使用未知伪元素选择器
     */
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep', 'deep'] }],
  },
}
