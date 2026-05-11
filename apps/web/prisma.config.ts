import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'prisma/config'

loadEnvConfig(process.cwd())

export default defineConfig({
  // vscode 插件卡顿，修复前先放这里面
  schema: 'prisma/models/',
  datasource: {
    url: process.env.DATABASE_URL
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  }
})
