import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * 缓存标签
 */
export const CacheTag = {
  EDGE_CONFIG: {
    NETEASE_CLOUD_MUSIC_COOKIE: 'netease-cloud-music-cookie'
  },
  FRIEND: 'friend',
  POST: 'post'
} as const

/**
 * 缓存清除
 */
export const CacheClear = {
  friend: () => {
    revalidateTag(CacheTag.FRIEND, 'max')
  },
  post: (id?: string) => {
    if (id) {
      revalidatePath(`/posts/${id}`)
    }
    revalidateTag(CacheTag.POST, 'max')
  }
}
