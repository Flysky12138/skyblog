import { CSSRuleObject } from 'tailwindcss/types/config'

export default {
  '.s-bg-content': {
    '@apply bg-white dark:bg-[#202026]': {}
  },
  '.s-bg-root': {
    '@apply bg-zinc-50 dark:bg-[#131318]': {}
  },
  '.s-bg-sheet': {
    '@apply bg-slate-200/30 dark:bg-zinc-700/30': {}
  },
  '.s-bg-title': {
    '@apply bg-white dark:bg-[#292d38]': {}
  },
  '.s-border-color-card': {
    '@apply border-slate-100 dark:border-zinc-700': {}
  },
  '.s-border-color-default': {
    borderColor: '#e5e7eb'
  },
  '.s-border-color-divider': {
    '@apply s-border-color-default dark:border-slate-700': {}
  },
  '.s-hidden-scrollbar': {
    '&::-webkit-scrollbar': {
      '@apply hidden': {}
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none'
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
  '.s-table-scrollbar': {
    '&::-webkit-scrollbar': {
      '@apply size-2': {}
    },
    '&::-webkit-scrollbar-corner': {
      '@apply bg-transparent': {}
    },
    '&::-webkit-scrollbar-thumb': {
      '@apply bg-zinc-300 dark:bg-zinc-600': {}
    },
    '&::-webkit-scrollbar-track': {
      '@apply bg-transparent': {}
    },
    'scrollbar-width': 'auto'
  },
  '.s-underline': {
    '@apply underline decoration-2 underline-offset-2': {}
  }
} satisfies CSSRuleObject
