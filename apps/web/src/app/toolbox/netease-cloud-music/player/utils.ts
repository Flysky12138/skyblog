import React from 'react'

import { rpc, unwrap } from '@/lib/http/rpc'

/**
 * 获取歌曲信息
 */
export const getSongDetails = React.cache(async (id: number | string) => {
  return rpc['netease-cloud-music'].songs({ id }).get().then(unwrap)
})

/**
 * 获取歌曲 URL
 */
export const getSongUrl = React.cache(async (id: number | string) => {
  const [{ url }] = await rpc['netease-cloud-music']
    .songs({ id })
    .url.get({ query: { level: 'standard' } })
    .then(unwrap)

  return url.replace('http:', 'https:')
})

/**
 * 获取歌词
 */
export const getLyric = React.cache(async (id: number | string) => {
  return rpc['netease-cloud-music'].songs({ id }).lyric.get().then(unwrap)
})
