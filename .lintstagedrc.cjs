// lintstaged config for vue project
module.exports = {
  '*.{html,css,less,sass,scss,mjs,js,jsx,ts,tsx,vue,json,yml,md}': 'prettier --write',
  '*.{css,scss,vue,html}': 'stylelint --fix',
  '*.{js,jsx,vue}': 'eslint --fix',
}
