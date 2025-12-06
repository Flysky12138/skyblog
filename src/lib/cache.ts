import { revalidateTag } from 'next/cache'

import { CACHE_TAG } from './constants'

/**
 * 缓存清除
 */
export abstract class CacheClear {
  static friend(id: string) {
    revalidateTag(CACHE_TAG.FRIEND(id), 'max')
  }

  static friends() {
    revalidateTag(CACHE_TAG.FRIENDS, 'max')
  }

  static post(id: string) {
    revalidateTag(CACHE_TAG.POST(id), 'max')
  }

  static posts() {
    revalidateTag(CACHE_TAG.POSTS, 'max')
  }
}
