import { Treaty } from '@elysiajs/eden'

import { POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { rpc } from '@/lib/http/rpc'

export type DefaultPostType = Treaty.Data<ReturnType<typeof rpc.dashboard.posts>['get']>

export type MessageEventDataPostPreviewMounted = MessageEventData<'post-preview-mounted'>
export type MessageEventDataPostUpdate = MessageEventData<'post-update', DefaultPostType>

/**
 * 文章预览 `BroadcastChannel` 频道 ID
 */
export const POST_PREVIEW_BROADCAST_CHANNEL_ID = '019b4b21-0bca-72dc-92da-b03b64c4299c'

/**
 * 默认文章数据
 */
export const DEFAULT_POST: DefaultPostType = {
  authorId: '',
  categories: [],
  commentCount: 0,
  content: null,
  cover: null,
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
}
