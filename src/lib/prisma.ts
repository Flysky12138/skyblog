import { PrismaClient } from '@prisma/client'
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const isDev = process.env.NODE_ENV == 'development'

const prismaClientSingleton = () => {
  const Prisma = isDev ? PrismaClient : PrismaClientEdge
  return new Prisma().$extends(withAccelerate())
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = global.prisma ?? prismaClientSingleton()
if (isDev) global.prisma = prisma

export default prisma
