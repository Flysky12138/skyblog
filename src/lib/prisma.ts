import { PrismaClient } from '@prisma/client'
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const isDev = process.env.NODE_ENV == 'development'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new (isDev ? PrismaClient : PrismaClientEdge)().$extends(withAccelerate())
if (isDev) globalForPrisma.prisma = prisma

export default prisma
