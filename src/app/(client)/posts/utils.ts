import { Prisma } from '@prisma/client'
import { toMerged } from 'es-toolkit'

import { prisma } from '@/lib/prisma'

/** 文章查询过滤器 */
export const POST_WHERE_INPUT: Prisma.PostWhereInput = {
  published: true
}

/** 文章查询 */
export const getPosts = async (page: number, where: Prisma.PostWhereInput = {}) => {
  return prisma.post.paginate(
    {
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
      where: toMerged(POST_WHERE_INPUT, where)
    },
    {
      limit: Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT),
      page
    }
  )
}
