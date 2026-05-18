import React from 'react'
import { z } from 'zod'

import { internal } from '@/lib/prisma'

import { getPosts } from '../utils'

/**
 * 获取所有文章的作者
 */
const getAuthors = React.cache(async () => {
  const posts = await getPosts()

  const authors = posts.map(post => post.authorId)

  const users = await internal.user.findMany({
    where: {
      id: {
        in: authors
      }
    }
  })

  return users
})

/**
 * 获取文章
 */
export const getPost = React.cache(async (idOrSlug: string) => {
  const { success: isUuidv7 } = await z.uuidv7().safeParseAsync(idOrSlug)

  const posts = await getPosts()
  const post = posts.find(post => (isUuidv7 ? idOrSlug == post.id : idOrSlug == post.slug))

  if (!post) return { post: null, user: null }

  const authors = await getAuthors()
  const user = authors.find(author => author.id == post.authorId)

  return {
    post,
    user
  }
})

/**
 * 获取推荐文章
 */
export const getPostsRecommendByPostId = React.cache(async (id: string) => {
  const posts = await getPosts()

  const index = posts.findIndex(post => post.id == id)

  if (index == -1) {
    return { next: null, prev: null }
  }

  const next = index == posts.length - 1 ? null : posts[index + 1]
  const prev = index == 0 ? null : posts[index - 1]

  return {
    next,
    prev
  }
})
