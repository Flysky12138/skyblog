import eslintPluginPerfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * @see https://eslint.org/docs/latest/rules
 */
const eslintRules = {
  // 使用函数表达式而不是函数声明
  'func-style': [2, 'expression'],
  // 要求使用箭头函数进行回调
  'prefer-arrow-callback': 2
}

/**
 * @see https://typescript-eslint.io/rules
 */
const tseslintRules = {
  '@typescript-eslint/ban-ts-comment': 0,
  '@typescript-eslint/no-empty-object-type': 0,
  '@typescript-eslint/no-explicit-any': 0,
  '@typescript-eslint/no-require-imports': 0,
  '@typescript-eslint/no-unused-expressions': 0,
  '@typescript-eslint/no-unused-vars': 0
}

const commonSortRules = [
  2,
  {
    customGroups: [{ elementNamePattern: '^on[A-Z]', groupName: 'onEvent', selector: 'property' }],
    groups: ['unknown', ['onEvent', 'method'], 'multiline-method'],
    order: 'asc',
    type: 'natural'
  }
]

/**
 * @see https://perfectionist.dev/rules
 */
const perfectionistRules = {
  'perfectionist/sort-interfaces': commonSortRules,
  // 关闭，使用 react/jsx-sort-props 规则
  'perfectionist/sort-jsx-props': 0,
  'perfectionist/sort-object-types': commonSortRules,
  'perfectionist/sort-objects': commonSortRules
}

/**
 * @see https://github.com/jsx-eslint/eslint-plugin-react
 */
const reactRules = {
  // 强制 props、state 和 context 使用解构赋值
  'react/destructuring-assignment': [2, 'always'],
  // 强制 useState 钩子值和 setter 变量的解构和对称命名
  'react/hook-use-state': [2, { allowDestructuredState: true }],
  // 强制 props 按字母顺序
  'react/jsx-sort-props': [
    2,
    {
      callbacksLast: true,
      ignoreCase: false,
      noSortAlphabetically: false,
      reservedFirst: true,
      shorthandFirst: true,
      shorthandLast: false
    }
  ],
  'react/no-unknown-property': 0,
  // 不允许没有子组件的组件使用额外的结束标签
  'react/self-closing-comp': [2, { component: true, html: true }]
}

/**
 * @see https://www.npmjs.com/package/eslint-plugin-react-hooks
 */
const reactHooksRules = {
  'react-hooks/exhaustive-deps': 2,
  'react-hooks/rules-of-hooks': 2
}

export default tseslint.config(
  {
    ignores: ['public/', '.next/', 'src/components/ui/', 'api.d.ts']
  },
  // https://typescript-eslint.io/users/configs/#projects-without-type-checking
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  // 关闭与 Prettier 冲突的 ESLint 规则
  // https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  eslintPluginPrettierRecommended,
  // 对各种数据结构进行排序
  // https://perfectionist.dev/configs/recommended-natural
  eslintPluginPerfectionist.configs['recommended-natural'],
  // https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#flat-configs
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  // 自定义规则
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 2020
      }
    },
    plugins: {
      'react-hooks': eslintPluginReactHooks
    },
    // @ts-ignore
    rules: {
      ...eslintRules,
      ...tseslintRules,
      ...perfectionistRules,
      ...reactRules,
      ...reactHooksRules
    }
  }
)
