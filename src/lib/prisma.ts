import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaNeon } from '@prisma/adapter-neon'
import { pagination } from 'prisma-extension-pagination'

import { PrismaClient } from '@/prisma/client'

import { isDev } from './utils'

class PrismaServiceBase extends PrismaClient {
  readonly prisma

  constructor() {
    const adapter = isDev()
      ? new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' })
      : // https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-vercel#vercel-postgres
        new PrismaNeon({ connectionString: process.env.POSTGRES_PRISMA_URL })

    super({ adapter })

    this.prisma = this.$extends(
      pagination({
        pages: {
          includePageCount: true,
          limit: 10
        }
      })
    )
  }
}

export const { prisma } = new PrismaServiceBase()
