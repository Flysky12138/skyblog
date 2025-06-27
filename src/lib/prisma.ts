import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import paginate from 'prisma-paginate'

import { isDev } from './utils'

const prismaClientSingleton = () => {
  let prisma = null
  if (isDev()) {
    prisma = new PrismaClient()
  } else {
    // https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-vercel#vercel-postgres
    const adapter = new PrismaNeon({ connectionString: process.env.POSTGRES_PRISMA_URL })
    prisma = new PrismaClient({ adapter })
  }
  return prisma.$extends(paginate)
}

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = global.prisma ?? prismaClientSingleton()
if (isDev()) global.prisma = prisma

export { prisma }
