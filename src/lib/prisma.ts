import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaNeon } from '@prisma/adapter-neon'
import { pagination } from 'prisma-extension-pagination'

import { Prisma, PrismaClient } from '@/prisma/client'

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
    ).$extends({
      query: {
        // https://github.com/prisma/prisma/discussions/9793
        $allOperations: async ({ args, model, query }) => {
          const result = await query(args)

          const modelNames: Prisma.ModelName[] = ['ActivityLog', 'Comment']

          if (!modelNames.includes(model as Prisma.ModelName)) {
            return result
          }

          return JSON.parse(
            JSON.stringify(result, (key, value) => {
              return typeof value == 'bigint' ? value.toString() : value
            })
          )
        }
      }
    })
  }
}

export const { prisma } = new PrismaServiceBase()
