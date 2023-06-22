import eslint from '@eslint/js'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic, pluginReactConfig, {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node
    }
  },
  rules: {
    'no-var': 'error',
    'func-style': ['error', 'expression'],
    'react/destructuring-assignment': ['error', 'always'],
    'react/hook-use-state': ['error', { allowDestructuredState: true }],
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        ignoreCase: false,
        noSortAlphabetically: false,
        reservedFirst: true,
        shorthandFirst: true,
        shorthandLast: false
      }
    ]
  }
})
