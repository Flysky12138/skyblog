const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: ['class', 'html[data-joy-color-scheme="dark"]'],
  important: '#next',
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addComponents }) => {
      addComponents(
        {
          '.s-bg-card': {
            '@apply bg-slate-200/30 dark:bg-zinc-700/30': {}
          },
          '.s-bg-root': {
            '@apply bg-white dark:bg-[#131318]': {}
          },
          '.s-bg-slate': {
            '@apply bg-slate-300/50 dark:bg-slate-700/50': {}
          },
          '.s-border-card': {
            '@apply border-slate-200 dark:border-zinc-700': {}
          },
          '.s-divider': {
            '@apply dark:border-slate-700': {}
          },
          '.s-hidden-scrollbar': {
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none'
          },
          '.s-link': {
            '@apply text-sky-500 dark:text-sky-500': {}
          },
          '.s-outline': {
            outline: 'var(--joy-focus-thickness, 2px) solid var(--joy-palette-focusVisible, #096bde)',
            'outline-offset': 'var(--focus-outline-offset, var(--joy-focus-thickness, 2px))'
          },
          '.s-skeleton': {
            '@apply animate-pulse bg-gray-300/30 backdrop-blur dark:bg-gray-700/20': {}
          },
          '.s-subtitle': {
            '@apply text-gray-500 dark:text-slate-400': {}
          },
          '.s-underline': {
            '@apply decoration-2 underline-offset-2 underline': {}
          }
        },
        {
          respectImportant: true
        }
      )
    })
  ],
  theme: {
    extend: {
      borderRadius: {
        inherit: 'inherit'
      },
      fontFamily: {
        body: 'MiSans L3',
        code: 'Cascadia Code PL',
        inherit: 'inherit',
        root: 'FZSJ-ZHUZAYTE',
        title: 'var(--font-title)'
      },
      height: {
        footer: '180px',
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
