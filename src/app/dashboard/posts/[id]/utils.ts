import { GET } from '@/app/api/dashboard/posts/[id]/route'
import { POST_CARD_VISIBILITY_MASK } from '@/lib/constants'

export type DefaultPostType = NonNullable<GET['return']>

export type MessageEventDataMounted = MessageEventData<'post-preview-mounted'>
export type MessageEventDataRefresh = MessageEventData<'post-refresh', DefaultPostType>

/**
 * `BroadcastChannel` 频道 ID
 */
export const BROADCAST_CHANNEL_ID = '019b4b21-0bca-72dc-92da-b03b64c4299c'

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
