import { reactConfig } from '@repo/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['./dist/**']
  },
  reactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
])
