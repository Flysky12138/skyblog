import { PrismaConfig } from 'prisma'

export default {
  earlyAccess: true,
  schema: './prisma/'
} satisfies PrismaConfig<NodeJS.ProcessEnv>
