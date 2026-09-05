import { baseConfig } from '@repo/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json', './playgrounds/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
])
