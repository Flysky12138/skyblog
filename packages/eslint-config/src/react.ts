import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

import { baseConfig } from './base'

export const reactConfig = defineConfig([
  baseConfig,

  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],

  // https://github.com/jsx-eslint/eslint-plugin-react
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser
      }
    },
    rules: {
      // 强制 props、state 和 context 使用解构赋值
      'react/destructuring-assignment': ['error', 'always'],
      // 强制 useState 钩子值和 setter 变量的解构和对称命名
      'react/hook-use-state': ['error', { allowDestructuredState: true }],
      // 允许使用未知的 DOM 属性
      'react/no-unknown-property': 'off',
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
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
  },

  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      // @ts-ignore
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/incompatible-library': 'off'
    }
  }
])
