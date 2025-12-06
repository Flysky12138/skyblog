import React from 'react'

import { internal, prisma } from '@/lib/prisma'

import { POST_ORDER_BY_DESC_INPUT, POST_WHERE_INPUT } from '../../utils'

/**
 * 获取文章
 */
export const getPost = async (id: string) => {
  const post = await prisma.post.findUnique({
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } }
    },
    where: { id }
  })

  if (!post) return { post: null, user: null }

  const user = await internal.user.findUnique({
    where: { id: post.authorId }
  })

  return { post, user }
}

/**
 * 获取所有文章
 */
const getAllPost = React.cache(async () => {
  return prisma.post.findMany({
    orderBy: POST_ORDER_BY_DESC_INPUT,
    select: {
      id: true,
      summary: true,
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

  if (index == -1) {
    return { next: null, prev: null }
  }

  const next = index == allPost.length - 1 ? null : allPost[index + 1]
  const prev = index == 0 ? null : allPost[index - 1]

  return { next, prev }
}
