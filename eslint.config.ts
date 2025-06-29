import eslintPluginPerfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

type ExtractConfig<T> = T extends unknown[] ? never : T
type InfiniteDepthConfigWithExtends = Parameters<typeof tseslint.config>[number]
type RuleEntry = Rules[string]
type Rules = Required<ExtractConfig<InfiniteDepthConfigWithExtends>>['rules']

/**
 * @see https://eslint.org.cn/docs/latest/rules
 */
const eslintRules = {
  // 使用函数表达式而不是函数声明
  'func-style': ['error', 'expression'],
  // 要求使用箭头函数进行回调
  'prefer-arrow-callback': 'error'
} satisfies Rules

/**
 * @see https://typescript-eslint.io/rules
 */
const tseslintRules = {
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-require-imports': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'none',
      caughtErrors: 'none',
      destructuredArrayIgnorePattern: '.',
      vars: 'all'
    }
  ]
} satisfies Rules

const sortRulesEntry = [
  'error',
  {
    customGroups: [{ elementNamePattern: '^on[A-Z]', groupName: 'onEvent', selector: 'property' }],
    groups: ['unknown', ['onEvent', 'method'], 'multiline-method'],
    order: 'asc',
    type: 'natural'
  }
] satisfies RuleEntry

/**
 * @see https://perfectionist.dev/rules
 */
const perfectionistRules = {
  'perfectionist/sort-interfaces': sortRulesEntry,
  // 关闭，使用 react/jsx-sort-props 规则
  'perfectionist/sort-jsx-props': 'off',
  'perfectionist/sort-object-types': sortRulesEntry,
  'perfectionist/sort-objects': sortRulesEntry
} satisfies Rules

/**
 * @see https://github.com/jsx-eslint/eslint-plugin-react
 */
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
  ],
  'react/no-unknown-property': 'off',
  // 不允许没有子组件的组件使用额外的结束标签
  'react/self-closing-comp': ['error', { component: true, html: true }]
} satisfies Rules

/**
 * @see https://www.npmjs.com/package/eslint-plugin-react-hooks
 */
const reactHooksRules = {
  'react-hooks/exhaustive-deps': 'error',
  'react-hooks/rules-of-hooks': 'error'
} satisfies Rules

/**
 * @see https://github.com/sweepline/eslint-plugin-unused-imports?tab=readme-ov-file#usage
 */
const unusedImportsRules = {
  'unused-imports/no-unused-imports': 'error'
} satisfies Rules

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
      '**/*.d.ts',
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
        'error',
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
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'unused-imports': eslintPluginUnusedImports
    },
    rules: {
      ...eslintRules,
      ...tseslintRules,
      ...perfectionistRules,
      ...reactRules,
      ...reactHooksRules,
      ...unusedImportsRules
    }
  }
)
