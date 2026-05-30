import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint, { FlatConfig } from 'typescript-eslint'

const sortObjectRulesEntry: FlatConfig.RuleEntry = [
  'error',
  {
    groups: ['unknown', 'multiline-property', ['method', 'onEvent'], 'multiline-method'],
    order: 'asc',
    type: 'natural',
    customGroups: [
      {
        elementNamePattern: '^on[A-Z]',
        groupName: 'onEvent',
        selector: 'property'
      }
    ]
  }
]

export const baseConfig = defineConfig([
  globalIgnores(['dist', '**/*.mjs']),

  js.configs.recommended,

  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  eslintPluginPrettierRecommended,

  perfectionist.configs['recommended-natural'],

  // https://eslint.org/docs/latest/rules/
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }]
    }
  },

  // https://typescript-eslint.io/rules
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
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
  },

  // https://github.com/prettier/eslint-plugin-prettier#options
  {
    rules: {
      'prettier/prettier': 'error'
    }
  },

  // https://github.com/sweepline/eslint-plugin-unused-imports?tab=readme-ov-file#usage
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off'
    }
  },

  // https://perfectionist.dev/rules
  {
    rules: {
      'perfectionist/sort-interfaces': sortObjectRulesEntry,
      // 关闭，使用 react/jsx-sort-props 规则
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-object-types': sortObjectRulesEntry,
      'perfectionist/sort-objects': sortObjectRulesEntry,
      'perfectionist/sort-exports': [
        'error',
        {
          groups: ['type-export', { newlinesBetween: 1 }],
          order: 'asc',
          partitionByComment: true,
          type: 'natural'
        }
      ]
    }
  }
])
