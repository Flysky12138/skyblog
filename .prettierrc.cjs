/** @type {import("prettier").Options} */
module.exports = {
  arrowParens: 'avoid',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-packagejson'],
  printWidth: 150,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  useTabs: false
}
