import { get } from '@vercel/edge-config'
import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'

import { neteaseRequest } from '../core'
import { LyricResponseType, SongDetailResponseType, UrlQueryType, UrlResponseType } from './model'
import { parseLyric } from './utils'

export abstract class Service {
  /**
   * 获取歌曲详情
   */
  static async detail(id: number): Promise<SongDetailResponseType> {
    'use cache'
    cacheLife('max')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    const cookie = await get<string>(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)

    const res = await neteaseRequest<{
      songs: SongDetailResponseType[]
    }>('/api/v3/song/detail', { c: `[{"id":${id}}]` }, { cookie, crypto: 'weapi' })

    return res.body.songs[0]
  }

  /**
   * 获取歌词
   */
  static async lyric(id: number): Promise<LyricResponseType> {
    'use cache'
    cacheLife('max')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    const cookie = await get<string>(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)

    const res = await neteaseRequest<{
      lrc: { lyric: string }
    }>('/api/song/lyric', { _nmclfl: 1, id, kv: -1, lv: -1, rv: -1, tv: -1 }, { cookie, crypto: 'eapi' })

    return {
      lrc: parseLyric(res.body.lrc.lyric),
      lrcText: res.body.lrc.lyric
    }
  }

  /**
   * 获取歌曲 url
   */
  static async url(id: number, { level = 'lossless' }: UrlQueryType): Promise<UrlResponseType> {
    'use cache'
    cacheLife('max')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    const cookie = await get<string>(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)

    const data: Record<string, unknown> = {
      encodeType: 'flac',
      ids: `[${id}]`,
      level
    }
    if (level === 'sky') {
      data.immerseType = 'c51'
    }

    const res = await neteaseRequest<{
      data: UrlResponseType
    }>(`/api/song/enhance/player/url/v1`, data, { cookie, crypto: 'eapi' })

    return res.body.data
  }
}
