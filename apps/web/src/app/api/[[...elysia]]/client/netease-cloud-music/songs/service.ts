/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// @ts-nocheck

import { get } from '@vercel/edge-config'
import { status } from 'elysia'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'
import { cacheLife, cacheTag } from 'next/cache'
import { createRequire } from 'node:module'

import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'

import { LyricResponseType, SongDetailResponseType, UrlQueryType, UrlResponseType } from './model'
import { parseLyric } from './utils'

const require = createRequire(import.meta.url)
const { lyric, song_detail, song_url_v1 } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

export abstract class Service {
  /**
   * 获取歌曲详情
   */
  static async detail(id: number): Promise<SongDetailResponseType> {
    'use cache'
    cacheLife('max')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    const cookie = await get<string>(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)

    try {
      const res = await song_detail({ cookie, ids: String(id) })
      return res.body.songs[0]
    } catch (error) {
      return status(500, { message: error.body.message })
    }
  }

  /**
   * 获取歌词
   */
  static async lyric(id: number): Promise<LyricResponseType> {
    'use cache'
    cacheLife('max')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    const cookie = await get<string>(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)

    try {
      const res = await lyric({ cookie, id })
      return {
        lrc: parseLyric(res.body.lrc.lyric),
        lrcText: res.body.lrc.lyric
      }
    } catch (error) {
      return status(500, { message: error.body.message })
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

    try {
      const res = await song_url_v1({ cookie, id, level })
      return res.body.data
    } catch (error) {
      return status(500, { message: error.body.message })
    }
  }
}
