import nextVitals from 'eslint-config-next/core-web-vitals'
import perfectionist from 'eslint-plugin-perfectionist'
// import prettier from 'eslint-plugin-prettier/recommended'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

type ExtractConfig<T> = T extends unknown[] ? never : T
type InfiniteDepthConfigWithExtends = Parameters<typeof tseslint.config>[number]
type RuleEntry = Rules[string]
type Rules = Required<ExtractConfig<InfiniteDepthConfigWithExtends>>['rules']

/**
 * eslint rules
 * @see https://eslint.org.cn/docs/latest/rules
 */
const eslintRules: Rules = {
  // 当通过 import 加载时，禁用指定的模块
  'no-restricted-imports': [
    'error',
    {
      paths: ['next/router'],
      patterns: ['@radix-ui/*', '!@radix-ui/react-slot']
    }
  ]
}

/**
 * tseslint rules
 * @see https://typescript-eslint.io/rules
 */
const tseslintRules: Rules = {
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-require-imports': 'off',
  '@typescript-eslint/no-unsafe-function-type': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/return-await': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'none',
      argsIgnorePattern: '^_',
      caughtErrors: 'none',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '.',
      ignoreRestSiblings: true,
      vars: 'all',
      varsIgnorePattern: '^_'
    }
  ]
}

// https://perfectionist.dev/rules/sort-objects#groups
const sortObjectRulesEntry: RuleEntry = [
  'error',
  {
    customGroups: [{ elementNamePattern: '^on[A-Z]', groupName: 'onEvent', selector: 'property' }],
    groups: ['unknown', 'multiline-property', ['method', 'onEvent'], 'multiline-method'],
    order: 'asc',
    type: 'natural'
  }
]

/**
 * perfectionist rules
 * @see https://perfectionist.dev/rules
 */
const perfectionistRules: Rules = {
  'perfectionist/sort-interfaces': sortObjectRulesEntry,
  // 关闭，使用 react/jsx-sort-props 规则
  'perfectionist/sort-jsx-props': 'off',
  'perfectionist/sort-object-types': sortObjectRulesEntry,
  'perfectionist/sort-objects': sortObjectRulesEntry
}

/**
 * unused-imports rules
 * @see https://github.com/sweepline/eslint-plugin-unused-imports?tab=readme-ov-file#usage
 */
const unusedImportsRules: Rules = {
  'unused-imports/no-unused-imports': 'error'
}

/**
 * react rules
 * @see https://github.com/jsx-eslint/eslint-plugin-react
 */
const reactRules: Rules = {
  'react-hooks/incompatible-library': 'off',
  // 强制 props、state 和 context 使用解构赋值
  'react/destructuring-assignment': ['error', 'always'],
  // 强制 useState 钩子值和 setter 变量的解构和对称命名
  'react/hook-use-state': ['error', { allowDestructuredState: true }],
  // 允许使用未知的 DOM 属性
  'react/no-unknown-property': 'off',
  // 不允许没有子组件的组件使用额外的结束标签
  'react/self-closing-comp': ['error', { component: true, html: true }],
  // 强制 React 组件使用 function 声明
  'react/function-component-definition': [
    'error',
    {
      namedComponents: 'function-declaration',
      unnamedComponents: 'function-expression'
    }
  ],
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

/**
 * next rules
 */
const nextRules: Rules = {
  '@next/next/no-img-element': 'off'
}

export default defineConfig([
  {
    ignores: ['public/', '.next/', 'src/components/ui/', 'src/generated/', 'next-env.d.ts', '*.mjs']
  },
  // https://typescript-eslint.io/users/configs/#projects-without-type-checking
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  // 关闭与 Prettier 冲突的 ESLint 规则
  // https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  /// 未知原因导致，显示保存时 className 排序错误
  // prettier,
  // 对各种数据结构进行排序
  // https://perfectionist.dev/configs/recommended-natural
  perfectionist.configs['recommended-natural'],
  // https://nextjs.org/docs/app/api-reference/config/eslint
  nextVitals,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true
      }
    },
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      ...eslintRules,
      ...tseslintRules,
      ...perfectionistRules,
      ...reactRules,
      ...unusedImportsRules,
      ...nextRules
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  // 禁止默认导出
  {
    ignores: [
      '**/*.d.ts',
      '**/*.config.ts',
      '**/{layout,page,loading,not-found,global-error,error,robots,sitemap,manifest,opengraph-image,proxy}.{ts,tsx}'
    ],
    rules: {
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
  }
])
