import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const where: Prisma.PostWhereInput = {
  published: true
}

export const getPosts = async (page: number, _where: Prisma.PostWhereInput = {}) => {
  const take = Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT)
  const skip = (page - 1) * take
  _where = Object.assign({}, where, _where)

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      orderBy: [{ sticky: 'desc' }, { updatedAt: 'desc' }],
      select: {
        categories: true,
        createdAt: true,
        description: true,
        id: true,
        sticky: true,
        tags: true,
        title: true,
        updatedAt: true
      },
      skip,
      take,
      where: _where
    }),
    prisma.post.count({ where: _where })
  ])

  return {
    data,
    pagination: { skip, take, total }
  }
}
