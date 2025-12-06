import { PrismaNeon } from '@prisma/adapter-neon'
import { pagination } from 'prisma-extension-pagination'
import superjson from 'superjson'

import { PrismaClient as InternalClient } from '@/generated/internal/client'
import { PrismaClient } from '@/generated/prisma/client'

import { isDev } from './utils'

const internalClientSingleton = () => {
  return new InternalClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  })
}

const prismaClientSingleton = () => {
  return new PrismaClient({
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
          return superjson.serialize(result).json
        }
      }
    })
}

// 每次热重载都会重新执行模块代码。只实例化一次，避免内存爆增
const globalForPrisma = globalThis as unknown as {
  internal?: ReturnType<typeof internalClientSingleton>
  prisma?: ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()
/**
 * 访问 Neon 平台自带表的 Prisma Client
 */
export const internal = globalForPrisma.internal ?? internalClientSingleton()

if (isDev()) {
  globalForPrisma.prisma = prisma
  globalForPrisma.internal = internal
}
