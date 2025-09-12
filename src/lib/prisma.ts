import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import { extension } from 'prisma-paginate'

import { isDev } from './utils'

class PrismaServiceBase extends PrismaClient {
  readonly prisma

  constructor() {
    super({
      adapter: isDev()
        ? null
        : // https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-vercel#vercel-postgres
          new PrismaNeon({ connectionString: process.env.POSTGRES_PRISMA_URL })
    })
    this.prisma = this.$extends(extension)
  }
}

export const { prisma } = new PrismaServiceBase()
