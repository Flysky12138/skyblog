import { Prisma } from '@/generated/prisma/client'

export const DEFAULT_ORDER_KEY = 'desc' satisfies Prisma.SortOrder
export const DEFAULT_SORTORD_KEY = 'updatedAt' satisfies keyof Prisma.PostOrderByWithRelationInput

/**
 * 默认文章排序
 */
export const POST_ORDER_BY_DESC_INPUT = [
  { pinOrder: 'desc' },
  { [DEFAULT_SORTORD_KEY]: DEFAULT_ORDER_KEY }
] satisfies Prisma.PostOrderByWithRelationInput[]

/**
 * 文章查询过滤器
 */
export const POST_WHERE_INPUT = {
  isPublished: true
} satisfies Prisma.PostWhereInput
