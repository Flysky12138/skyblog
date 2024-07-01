module.exports = {
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
  ignorePatterns: ['public'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-var': 'error',
    'func-style': ['error', 'expression'],
    'react/destructuring-assignment': ['error', 'always'],
    'react/hook-use-state': ['error', { allowDestructuredState: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
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
}
