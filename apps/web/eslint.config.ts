import { nextJsConfig } from '@repo/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['src/generated/']
  },
  nextJsConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
])
