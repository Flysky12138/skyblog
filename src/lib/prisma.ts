import { PrismaNeon } from '@prisma/adapter-neon'
import { pagination } from 'prisma-extension-pagination'

import { PrismaClient as InternalClient } from '@/generated/internal/client'
import { PrismaClient } from '@/generated/prisma/client'

/**
 * 访问 Neon 平台自带表的 Prisma Client
 */
export const internal = new InternalClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL })
})

export const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL })
})
  .$extends(
    pagination({
      pages: {
        includePageCount: true,
        limit: 10
      }
    })
  )
  .$extends({
    query: {
      // https://github.com/prisma/prisma/discussions/9793
      $allOperations: async ({ args, query }) => {
        const result = await query(args)
        return JSON.parse(
          JSON.stringify(result, (key, value) => {
            return typeof value == 'bigint' ? value.toString() : value
          })
        )
      }
    }
  })
