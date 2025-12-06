import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/prisma/client'

/**
 * 文章排序，降序
 */
export const POST_ORDER_BY_DESC_INPUT = [{ pinOrder: 'desc' }, { updatedAt: 'desc' }] satisfies Prisma.PostOrderByWithRelationInput[]

/**
 * 文章查询过滤器
 */
export const POST_WHERE_INPUT = {
  isPublished: true
} satisfies Prisma.PostWhereInput

/**
 * 文章查询
 */
export const getPosts = async (page: number, where: Prisma.PostWhereInput = {}) => {
  'use cache'
  cacheLife('max')
  cacheTag(CACHE_TAG.POSTS)

  const [posts, pagination] = await prisma.post
    .paginate({
      orderBy: POST_ORDER_BY_DESC_INPUT,
      select: {
        categories: true,
        createdAt: true,
        id: true,
        pinOrder: true,
        summary: true,
        tags: true,
        title: true,
        updatedAt: true
      },
      where: {
        ...POST_WHERE_INPUT,
        ...where
      }
    })
    .withPages({
      limit: Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT),
      page
    })

  return {
    pagination,
    posts
  }
}
