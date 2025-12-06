import React from 'react'

import { prisma } from '@/lib/prisma'

import { POST_ORDER_BY_DESC_INPUT, POST_WHERE_INPUT } from '../../utils'

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
 * 获取所有文章
 */
const getAllPost = React.cache(async () => {
  return prisma.post.findMany({
    orderBy: POST_ORDER_BY_DESC_INPUT,
    select: {
      description: true,
      id: true,
      title: true
    },
    where: POST_WHERE_INPUT
  })
})

/**
 * 获取推荐文章
 */
export const getPostsRecommendByPostId = async (id: string) => {
  const allPost = await getAllPost()

  const index = allPost.findIndex(post => post.id == id)

  if (index == -1) return { next: null, prev: null }

  const next = index == allPost.length - 1 ? null : allPost[index + 1]
  const prev = index == 0 ? null : allPost[index - 1]

  return { next, prev }
}
