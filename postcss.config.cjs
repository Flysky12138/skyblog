/* eslint-disable sort-keys-plus/sort-keys */
/** @type {import('postcss').ProcessOptions} */
module.exports = {
  plugins: {
    'tailwindcss/nesting': 'postcss-nested',
    tailwindcss: {},
    autoprefixer: {}
  }
}
