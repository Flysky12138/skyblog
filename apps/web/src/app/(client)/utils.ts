import { Prisma } from '@/generated/prisma/client'

export const POST_SORT_FIELDS = ['createdAt', 'updatedAt', 'viewCount'] satisfies (keyof Prisma.PostOrderByWithRelationInput)[]
export const SORT_DIRECTIONS = ['asc', 'desc'] satisfies Prisma.SortOrder[]

export const DEFAULT_POST_SORT_FIELD = 'updatedAt' satisfies keyof Prisma.PostOrderByWithRelationInput
export const DEFAULT_SORT_DIRECTION = 'desc' satisfies Prisma.SortOrder

/**
 * 文章排序
 */
export function createPostOrderByInput(
  field: (typeof POST_SORT_FIELDS)[number] = DEFAULT_POST_SORT_FIELD,
  direction: (typeof SORT_DIRECTIONS)[number] = DEFAULT_SORT_DIRECTION
) {
  return [{ pinOrder: 'desc' }, { [field]: direction }, { id: 'desc' }] satisfies Prisma.PostOrderByWithRelationInput[]
}

/**
 * 文章查询过滤器
 */
export const POST_WHERE_INPUT = {
  isPublished: true
} satisfies Prisma.PostWhereInput
