import { Treaty } from '@elysiajs/eden'

import { POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { rpc } from '@/lib/http/rpc'

export type PostType = Treaty.Data<ReturnType<typeof rpc.dashboard.posts>['get']>

/**
 * 初始文章数据
 */
export const createInitialPost: () => PostType = () => ({
  authorId: '',
  categories: [],
  commentCount: 0,
  content: null,
  cover: null,
  coverFile: null,
  coverFileId: null,
  createdAt: new Date(),
  id: '-1',
  isPublished: false,
  pinOrder: 0,
  slug: null,
  summary: null,
  tags: [],
  title: '',
  updatedAt: new Date(),
  viewCount: 0,
  visibilityMask: POST_CARD_VISIBILITY_MASK.HEADER | POST_CARD_VISIBILITY_MASK.COMMENT | POST_CARD_VISIBILITY_MASK.TOC
})
