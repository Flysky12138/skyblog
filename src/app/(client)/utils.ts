import { Prisma } from '@prisma/client'
import { toMerged } from 'es-toolkit'

import { prisma } from '@/lib/prisma'

/**
 * 文章排序，降序
 */
export const POST_ORDER_BY_DESC_INPUT = [{ sticky: 'desc' }, { updatedAt: 'desc' }] satisfies Prisma.PostOrderByWithRelationInput[]
/**
 * 文章排序，升序
 */
export const POST_ORDER_BY_ASC_INPUT = [{ sticky: 'asc' }, { updatedAt: 'asc' }] satisfies Prisma.PostOrderByWithRelationInput[]

/**
 * 文章查询过滤器
 */
export const POST_WHERE_INPUT = {
  published: true
} satisfies Prisma.PostWhereInput

/**
 * 文章查询
 */
export const getPosts = async (page: number, where: Prisma.PostWhereInput = {}) => {
  return prisma.post.paginate(
    {
      orderBy: POST_ORDER_BY_DESC_INPUT,
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
