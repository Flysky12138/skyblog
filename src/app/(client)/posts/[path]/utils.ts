import React from 'react'
import { z } from 'zod'

import { internal, prisma } from '@/lib/prisma'

import { getPosts } from '../utils'

/**
 * 获取文章
 */
export const getPost = React.cache(async (idOrSlug: string) => {
  const { data: id, success } = await z.uuidv7().safeParseAsync(idOrSlug)

  const post = await prisma.post.findUnique({
    where: success ? { id } : { slug: idOrSlug },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } }
    }
  })

  if (!post) return { post: null, user: null }

  const user = await internal.user.findUnique({
    where: { id: post.authorId }
  })

  return { post, user }
})

/**
 * 获取推荐文章
 */
export const getPostsRecommendByPostId = async (id: string) => {
  const posts = await getPosts()

  const index = posts.findIndex(post => post.id == id)

  if (index == -1) {
    return { next: null, prev: null }
  }

  const next = index == posts.length - 1 ? null : posts[index + 1]
  const prev = index == 0 ? null : posts[index - 1]

  return { next, prev }
}
