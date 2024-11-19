import typography from '@tailwindcss/typography'
import { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import components from './tailwind.components'

export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: ['class', 'html[data-joy-color-scheme="dark"]'],
  important: '#next',
  plugins: [
    typography,
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
        footer: '10',
        header: '1000',
        main: '100',
        nav: '500'
      }
    }
  }
} satisfies Config
