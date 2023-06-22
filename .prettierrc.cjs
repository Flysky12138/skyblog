/** @type {import("prettier").Options} */
module.exports = {
  printWidth: 150,
  useTabs: false,
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'none',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss']
}
