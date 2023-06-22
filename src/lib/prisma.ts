import { PrismaClient } from '@prisma/client'

/**
 * not support vercel's edge
 * @see https://github.com/prisma/prisma/issues/20566
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV == 'development') globalForPrisma.prisma = prisma

export default prisma
