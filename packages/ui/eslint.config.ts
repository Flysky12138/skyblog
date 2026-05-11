import { reactConfig } from '@repo/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['./src/components/', './src/hooks/use-mobile.ts', './src/lib/']
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
