import React from 'react'

import { prisma } from '@/lib/prisma'

import { POST_ORDER_BY_DESC_INPUT, POST_WHERE_INPUT } from '../utils'

/**
 * 获取所有文章，过滤了的且使用默认排序
 */
export const getPosts = React.cache(async () => {
  return prisma.post.findMany({
    orderBy: POST_ORDER_BY_DESC_INPUT,
    where: POST_WHERE_INPUT,
    select: {
      id: true,
      slug: true,
      summary: true,
      title: true,
      updatedAt: true
    }
  })
})
