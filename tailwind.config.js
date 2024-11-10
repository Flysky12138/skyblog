const plugin = require('tailwindcss/plugin')
const components = require('./tailwind.components')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: ['class', 'html[data-joy-color-scheme="dark"]'],
  important: '#next',
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addComponents }) => {
      addComponents(components, {
        respectImportant: true
      })
    })
  ],
  theme: {
    extend: {
      borderRadius: {
        inherit: 'inherit'
      },
      fontFamily: {
        body: '"Microsoft Yahei", "微软雅黑", arial, sans-serif',
        code: '"Cascadia Code PL"',
        inherit: 'inherit',
        root: 'FZSJ-ZHUZAYTE',
        title: 'var(--font-title)'
      },
      height: {
        footer: '150px',
        header: '50px'
      },
      zIndex: {
        footer: 10,
        header: 1000,
        main: 100,
        nav: 500
      }
    }
  }
}
