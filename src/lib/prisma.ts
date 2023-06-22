import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'

const prismaClientSingleton = () => {
  if (isDev) return new PrismaClient()
  // https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-vercel#vercel-postgres
  const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
  const adapter = new PrismaNeon(pool)
  // @ts-ignore
  return new PrismaClient({ adapter })
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = global.prisma ?? prismaClientSingleton()
if (isDev) global.prisma = prisma

export default prisma
