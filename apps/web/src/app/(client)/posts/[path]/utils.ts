import { ExtensionKit } from '@repo/rich-text-editor/extensions'
import { renderJSONContentToHTMLString } from '@repo/rich-text-editor/render'
import { cacheLife, cacheTag } from 'next/cache'
import React from 'react'
import { z } from 'zod'

import { CACHE_TAG } from '@/lib/constants'
import { prisma, prismaAuth } from '@/lib/prisma'

/**
 * 获取作者
 */
async function getAuthor(id: string) {
  'use cache'
  cacheLife('max')
  cacheTag(CACHE_TAG.AUTHOR(id))

  return prismaAuth.user.findUnique({
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

  // 渲染内容
  post.content = post.content?.startsWith('<')
    ? post.content
    : await renderJSONContentToHTMLString(JSON.parse(post.content ?? 'null') as Node, { extensions: [ExtensionKit] })

  const user = await getAuthor(post.authorId)

  return {
    post,
    user
  }
})
