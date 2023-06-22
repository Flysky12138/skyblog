const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  extends: ['next/core-web-vitals', 'plugin:react/jsx-runtime', 'plugin:typescript-sort-keys/recommended', 'plugin:prettier/recommended'],
  ignorePatterns: ['public'],
  parser: '@typescript-eslint/parser',
  plugins: ['typescript-sort-keys', 'sort-keys-plus'],
  rules: {
    'func-style': ['error', 'expression'],
    'no-var': 'error',
    'react/destructuring-assignment': ['warn', 'always'],
    'react/hook-use-state': ['warn', { allowDestructuredState: true }],
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        ignoreCase: false,
        noSortAlphabetically: false,
        reservedFirst: true,
        shorthandFirst: true,
        shorthandLast: false
      }
    ],
    'sort-keys-plus/sort-keys': ['error', 'asc', { allowLineSeparatedGroups: true }]
  }
})
