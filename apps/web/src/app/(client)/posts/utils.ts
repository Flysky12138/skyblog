import { mapValues } from 'es-toolkit'
import React from 'react'

import { Post } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

import { createPostOrderByInput, POST_WHERE_INPUT } from '../utils'

/**
 * 获取所有文章，过滤了且使用默认排序
 */
export const getPosts = React.cache(async () => {
  return prisma.post.findMany({
    orderBy: createPostOrderByInput(),
    where: POST_WHERE_INPUT,
    select: {
      id: true,
      slug: true,
      updatedAt: true
    }
  })
})

/**
 * 获取相邻文章
 */
export async function getPrevNextPost({ id, pinOrder, updatedAt }: Pick<Post, 'id' | 'pinOrder' | 'updatedAt'>) {
  const [prev, next] = await Promise.all([
    prisma.post.findFirst({
      orderBy: createPostOrderByInput().map(item => mapValues(item, value => (value === 'desc' ? 'asc' : 'desc'))),
      where: {
        ...POST_WHERE_INPUT,
        OR: [
          {
            pinOrder: {
              gt: pinOrder
            }
          },
          {
            pinOrder,
            updatedAt: {
              gt: updatedAt
            }
          },
          {
            pinOrder,
            updatedAt,
            id: {
              gt: id
            }
          }
        ]
      }
    }),
    prisma.post.findFirst({
      orderBy: createPostOrderByInput(),
      where: {
        ...POST_WHERE_INPUT,
        OR: [
          {
            pinOrder: {
              lt: pinOrder
            }
          },
          {
            pinOrder,
            updatedAt: {
              lt: updatedAt
            }
          },
          {
            pinOrder,
            updatedAt,
            id: {
              lt: id
            }
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
