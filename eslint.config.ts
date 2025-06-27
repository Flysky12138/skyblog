import eslintPluginPerfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * 规则严重性
 * @see https://eslint.org.cn/docs/latest/use/configure/rules#rule-severities
 */
enum RuleSeverity {
  error = 2,
  off = 0,
  warn = 1
}

/**
 * @see https://eslint.org.cn/docs/latest/rules
 */
const eslintRules = {
  // 使用函数表达式而不是函数声明
  'func-style': [RuleSeverity.error, 'expression'],
  // 要求使用箭头函数进行回调
  'prefer-arrow-callback': RuleSeverity.error
}

/**
 * @see https://typescript-eslint.io/rules
 */
const tseslintRules = {
  '@typescript-eslint/ban-ts-comment': RuleSeverity.off,
  '@typescript-eslint/no-empty-object-type': RuleSeverity.off,
  '@typescript-eslint/no-explicit-any': RuleSeverity.off,
  '@typescript-eslint/no-require-imports': RuleSeverity.off,
  '@typescript-eslint/no-unused-expressions': RuleSeverity.off,
  '@typescript-eslint/no-unused-vars': RuleSeverity.off
}

const commonSortRules = [
  RuleSeverity.error,
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
  'perfectionist/sort-jsx-props': RuleSeverity.off,
  'perfectionist/sort-object-types': commonSortRules,
  'perfectionist/sort-objects': commonSortRules
}

/**
 * @see https://github.com/jsx-eslint/eslint-plugin-react
 */
const reactRules = {
  // 强制 props、state 和 context 使用解构赋值
  'react/destructuring-assignment': [RuleSeverity.error, 'always'],
  // 强制 useState 钩子值和 setter 变量的解构和对称命名
  'react/hook-use-state': [RuleSeverity.error, { allowDestructuredState: true }],
  // 强制 props 按字母顺序
  'react/jsx-sort-props': [
    RuleSeverity.error,
    {
      callbacksLast: true,
      ignoreCase: false,
      noSortAlphabetically: false,
      reservedFirst: true,
      shorthandFirst: true,
      shorthandLast: false
    }
  ],
  'react/no-unknown-property': RuleSeverity.off,
  // 不允许没有子组件的组件使用额外的结束标签
  'react/self-closing-comp': [RuleSeverity.error, { component: true, html: true }]
}

/**
 * @see https://www.npmjs.com/package/eslint-plugin-react-hooks
 */
const reactHooksRules = {
  'react-hooks/exhaustive-deps': RuleSeverity.error,
  'react-hooks/rules-of-hooks': RuleSeverity.error
}

export default tseslint.config(
  {
    ignores: ['public/', '.next/', 'api.d.ts']
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
    ignores: [
      '*.config.ts',
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx',
      'src/app/**/error.tsx',
      'src/app/**/loading.tsx',
      'src/app/**/not-found.tsx',
      'src/app/**/robots.ts',
      'src/app/**/sitemap.ts',
      'src/app/**/global-error.tsx',
      'src/app/**/manifest.ts',
      'src/mdx/**/*.tsx'
    ],
    rules: {
      // 禁止默认导出
      'no-restricted-exports': [
        RuleSeverity.error,
        {
          restrictDefaultExports: {
            defaultFrom: true,
            direct: true,
            named: true,
            namedFrom: true,
            namespaceFrom: true
          }
        }
      ]
    }
  },
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
