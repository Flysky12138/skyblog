'use cache'

import { get } from '@vercel/edge-config'
import { cacheLife, cacheTag } from 'next/cache'

import { CacheTag } from '@/lib/cache'
import { VERCEL_EDGE_CONFIG } from '@/lib/constants'

export const getNeteaseCloudMusicCookie = async () => {
  cacheLife('max')
  cacheTag(CacheTag.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

  const cookie = await get(VERCEL_EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)
  return cookie as string
}
