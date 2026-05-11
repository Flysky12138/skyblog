// @ts-nocheck

import { toMerged } from 'es-toolkit'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'
import { cacheLife, cacheTag } from 'next/cache'
import { createRequire } from 'node:module'

import { CACHE_TAG } from '@/lib/constants'

import {
  AlbumResponseType,
  LyricResponseType,
  PlaylistResponseType,
  SearchQueryType,
  SearchResponseType,
  SongUrlQueryType,
  SongUrlResponseType
} from './model'
import { getNeteaseCloudMusicCookie, parseLyric } from './utils'

const require = createRequire(import.meta.url)
const { album, cloudsearch, lyric, playlist_detail, song_url_v1 } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

export abstract class Service {
  /**
   * 获取专辑详情
   */
  static async album(id: number): Promise<AlbumResponseType> {
    'use cache'
    cacheLife('days')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    try {
      const res = await album({ cookie: await getNeteaseCloudMusicCookie(), id })
      return {
        hasMore: false,
        songCount: res.body.album.size,
        songs: res.body.songs.map(song => {
          return toMerged(song, {
            al: {
              picUrl: res.body.album.picUrl
            }
          })
        })
      }
    } catch (error) {
      throw new Error(error.body.message, { cause: error })
    }
  }

  /**
   * 获取歌词
   */
  static async lyric(id: number): Promise<LyricResponseType> {
    'use cache'
    cacheLife('max')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    try {
      const res = await lyric({ cookie: await getNeteaseCloudMusicCookie(), id })
      return {
        lrc: parseLyric(res.body.lrc.lyric),
        lrcText: res.body.lrc.lyric
      }
    } catch (error) {
      throw new Error(error.body.message, { cause: error })
    }
  }

  /**
   * 获取歌单列表
   */
  static async playlist(id: number): Promise<PlaylistResponseType> {
    'use cache'
    cacheLife('days')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    try {
      const res = await playlist_detail({ cookie: await getNeteaseCloudMusicCookie(), id })
      return {
        hasMore: false,
        songCount: res.body.playlist.trackCount,
        songs: res.body.playlist.tracks
      }
    } catch (error) {
      throw new Error(error.body.message, { cause: error })
    }
  }

  /**
   * 搜索
   */
  static async search({ keywords, limit = 100, page = 0, type = 1 }: SearchQueryType): Promise<SearchResponseType> {
    'use cache'
    cacheLife('days')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    try {
      const res = await cloudsearch({ cookie: await getNeteaseCloudMusicCookie(), keywords, limit, offset: page * limit, type })
      return {
        hasMore: res.body.result.songCount > (page + 1) * limit,
        songCount: res.body.result.songCount,
        songs: res.body.result.songs
      }
    } catch (error) {
      throw new Error(error.body.message, { cause: error })
    }
  }

  /**
   * 获取歌曲 url
   */
  static async songUrl(id: number, { level = 'lossless' }: SongUrlQueryType): Promise<SongUrlResponseType> {
    'use cache'
    cacheLife('max')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    try {
      const res = await song_url_v1({ cookie: await getNeteaseCloudMusicCookie(), id, level })
      return res.body.data
    } catch (error) {
      throw new Error(error.body.message, { cause: error })
    }
  }
}
