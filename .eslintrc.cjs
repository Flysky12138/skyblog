// https://eslint.org/docs/latest/rules
const eslintRules = {
  // 使用函数表达式而不是函数声明
  'func-style': ['error', 'expression'],
  // import 之间不允许有空行，之后必须有空行
  'padding-line-between-statements': ['error', { blankLine: 'always', next: '*', prev: 'import' }, { blankLine: 'never', next: 'import', prev: 'import' }],
  // 要求使用箭头函数进行回调
  // 'prefer-arrow-callback': 'error', // 注释掉，目前 React.forwardRef 需要，等 React19 可开启
  // 优先使用 const
  'prefer-const': 'error'
}

// https://typescript-eslint.io/rules/
const tseslintRules = {
  // 禁用 var
  'no-var': 'error'
}

// https://github.com/jsx-eslint/eslint-plugin-react
const reactRules = {
  // 强制 props、state 和 context 使用解构赋值
  'react/destructuring-assignment': ['error', 'always'],
  // 强制 useState 钩子值和 setter 变量的解构和对称命名
  'react/hook-use-state': ['error', { allowDestructuredState: true }],
  // 强制 props 按字母顺序
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

// https://www.npmjs.com/package/eslint-plugin-react-hooks
const reactHooksRules = {
  'react-hooks/exhaustive-deps': 'error',
  'react-hooks/rules-of-hooks': 'error'
}

// https://github.com/forivall/eslint-plugin-sort-keys-plus
const sortKeysPlusRules = {
  'sort-keys-plus/sort-keys': ['error', 'asc', { allCaps: 'ignore', natural: true, shorthand: 'first' }]
}

// https://github.com/infctr/eslint-plugin-typescript-sort-keys
const typescriptSortKeysRules = {
  'typescript-sort-keys/interface': 'error',
  'typescript-sort-keys/string-enum': 'error'
}

module.exports = {
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
  ignorePatterns: ['public'],
  parser: '@typescript-eslint/parser',
  plugins: ['eslint-plugin-sort-keys-plus', 'typescript-sort-keys'],
  rules: {
    ...eslintRules,
    ...tseslintRules,
    ...reactRules,
    ...reactHooksRules,
    ...sortKeysPlusRules,
    ...typescriptSortKeysRules
  }
}
