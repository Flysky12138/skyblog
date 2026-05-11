import { reactConfig } from '@repo/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  reactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/require-await': 'off'
    }
  }
])
