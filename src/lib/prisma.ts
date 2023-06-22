import { PrismaClient } from '@prisma/client'
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma = globalForPrisma.prisma

if (!prisma) {
  if (process.env.NODE_ENV == 'development') {
    prisma = new PrismaClient()
    globalForPrisma.prisma = prisma
  } else {
    // @ts-ignore
    prisma = new PrismaClientEdge().$extends(withAccelerate())
  }
}

export default prisma
