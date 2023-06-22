import { Prisma } from '@prisma/client'

export const include = Prisma.validator<Prisma.PostInclude>()({
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
})
