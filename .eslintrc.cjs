module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/prettier',
  ],
  overrides: [
    {
      files: ['cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'simple-import-sort'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
      },
    },
  },
  globals: {
    __webpack_public_path__: 'writable',
  },
  rules: {
    /**
     * @desc 配合simple-import-sort插件 进行导入的排序
     */
    'simple-import-sort/imports': 'error',

    /**
     * @desc 配合simple-import-sort插件 进行导出的排序
     */
    'simple-import-sort/exports': 'error',

    'import/no-unresolved': ['error', { ignore: ['^node:'] }],

    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
  },
}
