import { PrismaNeon } from '@prisma/adapter-neon'
import { pagination } from 'prisma-extension-pagination'
import { serialize } from 'superjson'

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
      /**
       * Prisma Client returns records as POJOs, and if you attempt to stringify
       * an object w/ a `BigInt` field, the client will return an error;
       * for that reason, we need to cast it to a string.
       * @see https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types#serializing-bigint
       */
      query: {
        $allOperations: async ({ args, query }) => {
          const result = await query(args)
          return serialize(result).json
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
