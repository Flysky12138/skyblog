import { revalidateTag } from 'next/cache'

/**
 * 缓存标签
 */
export const CacheTag = {
  EDGE_CONFIG: {
    NETEASE_CLOUD_MUSIC_COOKIE: 'netease-cloud-music-cookie'
  },
  FRIENDS: 'friends',
  POSTS: 'posts',
  FRIEND: (id: string) => `friend-${id}` as const,
  POST: (id: string) => `post-${id}` as const
} as const

/**
 * 缓存清除
 */
export const CacheClear = {
  friend: (id: string) => {
    revalidateTag(CacheTag.FRIEND(id), 'max')
  },
  friends: () => {
    revalidateTag(CacheTag.FRIENDS, 'max')
  },
  post: (id: string) => {
    revalidateTag(CacheTag.POST(id), 'max')
  },
  posts: () => {
    revalidateTag(CacheTag.POSTS, 'max')
  }
}
