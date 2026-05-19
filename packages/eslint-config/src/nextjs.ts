import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig, globalIgnores } from 'eslint/config'

import { reactConfig } from './react'

export const nextJsConfig = defineConfig([
  globalIgnores(['public/', '.next/**', 'build/**', 'next-env.d.ts']),

  reactConfig,

  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'off'
    }
  },

  // https://eslint.org.cn/docs/latest/rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // 当通过 import 加载时，禁用指定的模块
      'no-restricted-imports': [
        'error',
        {
          paths: ['next/router']
        }
      ]
    }
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/require-await': 'off'
    }
  }
])
