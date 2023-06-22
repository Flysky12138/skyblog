import { Prisma } from '@prisma/client'

export const include = {
  categories: {
    select: {
      id: true,
      name: true
    }
  },
  tags: {
    select: {
      id: true,
      name: true
    }
  }
} satisfies Prisma.PostInclude
