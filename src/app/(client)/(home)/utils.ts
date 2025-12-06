import { cacheLife, cacheTag } from 'next/cache'
import { z } from 'zod'

import { Prisma } from '@/generated/prisma/client'
import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

import { DEFAULT_SORT_KEY, DEFAULT_SORT_VALUE, POST_WHERE_INPUT } from '../utils'

const SORT_VALUES = ['asc', 'desc'] satisfies Prisma.SortOrder[]
const SORT_KEYS = ['createdAt', 'updatedAt', 'viewCount'] satisfies (keyof Prisma.PostOrderByWithRelationInput)[]

export const PostSearchParamsSchema = z.strictObject({
  categories: z.string().optional(),
  order: z.enum(SORT_VALUES).default(DEFAULT_SORT_VALUE),
  page: z.coerce.number().int().positive().default(1),
  sortord: z.enum(SORT_KEYS).default(DEFAULT_SORT_KEY),
  tags: z.string().optional()
})
export type PostSearchParamsType = z.infer<typeof PostSearchParamsSchema>

/**
 * 获取文章列表
 */
export const getPostList = async ({ categories, order, page, sortord, tags }: PostSearchParamsType) => {
  'use cache'
  cacheLife('max')
  cacheTag(CACHE_TAG.POSTS)

  const where = {
    categories: categories ? { some: { category: { name: decodeURIComponent(categories) } } } : undefined,
    tags: tags ? { some: { tag: { name: decodeURIComponent(tags) } } } : undefined
  }

  const orderBy = [{ pinOrder: 'desc' }, { [sortord]: order }] satisfies Prisma.PostOrderByWithRelationInput[]

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
