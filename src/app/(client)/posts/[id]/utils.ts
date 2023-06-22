import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { POST_ORDER_BY_ASC_INPUT, POST_ORDER_BY_DESC_INPUT, POST_WHERE_INPUT } from '../../utils'

/**
 * 获取文章
 */
export const getPost = async (id: string) => {
  return prisma.post.findUnique({
    include: {
      author: true,
      categories: true,
      tags: true
    },
    where: {
      ...POST_WHERE_INPUT,
      id
    }
  })
}

/**
 * 获取推荐文章
 */
export const getPostsRecommend = async (post: NonNullable<Awaited<ReturnType<typeof getPost>>>) => {
  const select = {
    description: true,
    id: true,
    title: true
  } satisfies Prisma.PostSelect

  const [prev, next] = await Promise.all([
    prisma.post.findFirst({
      orderBy: POST_ORDER_BY_ASC_INPUT,
      select,
      where: {
        ...POST_WHERE_INPUT,
        OR: [
          {
            sticky: post.sticky,
            updatedAt: { gt: post.updatedAt }
          },
          {
            sticky: { gt: post.sticky }
          }
        ]
      }
    }),
    prisma.post.findFirst({
      orderBy: POST_ORDER_BY_DESC_INPUT,
      select,
      where: {
        ...POST_WHERE_INPUT,
        OR: [
          {
            sticky: post.sticky,
            updatedAt: { lt: post.updatedAt }
          },
          {
            sticky: { lt: post.sticky }
          }
        ]
      }
    })
  ])

  return {
    next,
    prev
  }
}
