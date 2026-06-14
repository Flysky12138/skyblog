import { cacheLife, cacheTag } from 'next/cache'
import { z } from 'zod'

import { Prisma } from '@/generated/prisma/client'
import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

import {
  createPostOrderByInput,
  DEFAULT_POST_SORT_FIELD,
  DEFAULT_SORT_DIRECTION,
  POST_SORT_FIELDS,
  POST_WHERE_INPUT,
  SORT_DIRECTIONS
} from '../utils'

export const PostSearchParamsSchema = z.strictObject({
  categories: z.string().optional(),
  direction: z.enum(SORT_DIRECTIONS).default(DEFAULT_SORT_DIRECTION),
  field: z.enum(POST_SORT_FIELDS).default(DEFAULT_POST_SORT_FIELD),
  page: z.coerce.number().int().positive().default(1),
  tags: z.string().optional()
})
export type PostSearchParamsType = z.infer<typeof PostSearchParamsSchema>

/**
 * 获取文章列表
 */
export async function getPostList({ categories, direction, field, page, tags }: PostSearchParamsType) {
  'use cache: remote'
  cacheLife('max')
  cacheTag(CACHE_TAG.POSTS)

  const where = {
    categories: categories ? { some: { category: { name: decodeURIComponent(categories) } } } : undefined,
    tags: tags ? { some: { tag: { name: decodeURIComponent(tags) } } } : undefined
  } satisfies Prisma.PostWhereInput

  const orderBy = createPostOrderByInput(field, direction)

  const [posts, pagination] = await prisma.post
    .paginate({
      orderBy,
      select: {
        createdAt: true,
        id: true,
        pinOrder: true,
        slug: true,
        summary: true,
        title: true,
        updatedAt: true,
        categories: {
          select: {
            category: true
          }
        },
        tags: {
          select: {
            tag: true
          }
        }
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
