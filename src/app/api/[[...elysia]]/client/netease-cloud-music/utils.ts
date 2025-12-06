import { get } from '@vercel/edge-config'
import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'
import { timeToSeconds } from '@/lib/parser/time'

/**
 * 获取网易云音乐 Cookie
 */
export const getNeteaseCloudMusicCookie = async () => {
  'use cache'
  cacheLife('max')
  cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

  const cookie = await get(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)
  return cookie as string
}

/**
 * 处理网易云音乐的歌词
 */
export const parseLyric = (lyric?: string) => {
  if (!lyric) return null

  const matcher = lyric.matchAll(/\[([\d:.]+)\]\r*(.*)$/gm)
  let lyrics = Array.from(matcher, ([_, second, lrc]) => ({
    lyric: lrc.trim(),
    time: timeToSeconds(second, 'mm:ss.'.padEnd(second.length, 'S'))
  }))

  // 过滤存在错误数据的歌词
  lyrics = lyrics.filter((lyric, index) => {
    if (index == 0) return true
    const preLyric = lyrics[index - 1]
    if (lyric.lyric == preLyric.lyric) return false // 前后歌词一样
    if (lyric.time < preLyric.time) return false // 时间不是单调非递减
    return true
  })

  if (lyrics.length == 0) return null

  return lyrics
}
