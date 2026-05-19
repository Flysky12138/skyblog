import { cacheLife, cacheTag } from 'next/cache'
import React from 'react'
import { z } from 'zod'

import { CACHE_TAG } from '@/lib/constants'
import { internal, prisma } from '@/lib/prisma'

/**
 * 获取作者
 */
const getAuthor = async (id: string) => {
  'use cache'
  cacheLife('max')
  cacheTag(CACHE_TAG.AUTHOR(id))

  return internal.user.findUnique({
    where: { id }
  })
}

/**
 * 获取文章
 */
export const getPost = React.cache(async (idOrSlug: string) => {
  const { data: id, success } = await z.uuidv7().safeParseAsync(idOrSlug)

  const post = await prisma.post.findUnique({
    where: success ? { id } : { slug: idOrSlug },
    include: {
      categories: {
        include: {
          category: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  if (!post) {
    return { post: null, user: null }
  }

  const user = await getAuthor(post.authorId)

  return {
    post,
    user
  }
})
