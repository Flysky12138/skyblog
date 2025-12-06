'use cache'

import { get } from '@vercel/edge-config'
import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'

export const getNeteaseCloudMusicCookie = async () => {
  cacheLife('max')
  cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

  const cookie = await get(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)
  return cookie as string
}
