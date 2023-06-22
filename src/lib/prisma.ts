import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import paginate from 'prisma-paginate'

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'

const prismaClientSingleton = () => {
  let prisma = null
  if (isDev) {
    prisma = new PrismaClient()
  } else {
    // https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-vercel#vercel-postgres
    const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
    const adapter = new PrismaNeon(pool)
    // @ts-ignore
    prisma = new PrismaClient({ adapter })
  }
  return prisma.$extends(paginate)
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = global.prisma ?? prismaClientSingleton()
if (isDev) global.prisma = prisma

export default prisma
