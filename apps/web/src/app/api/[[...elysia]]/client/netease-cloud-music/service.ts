import { get } from '@vercel/edge-config'
import { toMerged } from 'es-toolkit'
import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'

import { neteaseRequest } from './core'
import { AlbumResponseType, PlaylistResponseType, SearchQueryType, SearchResponseType } from './model'
import { SongDetailResponseType } from './songs/model'

export abstract class Service {
  /**
   * 获取专辑详情
   */
  static async album(id: number): Promise<AlbumResponseType> {
    'use cache'
    cacheLife('days')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    const cookie = await get<string>(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)

    const res = await neteaseRequest<{
      album: { picUrl: string; size: number }
      songs: SongDetailResponseType[]
    }>(`/api/v1/album/${id}`, {}, { cookie, crypto: 'weapi' })

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
  }

  /**
   * 获取歌单列表
   */
  static async playlist(id: number): Promise<PlaylistResponseType> {
    'use cache'
    cacheLife('days')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    const cookie = await get<string>(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)

    const res = await neteaseRequest<{
      playlist: {
        trackCount: number
        tracks: SongDetailResponseType[]
      }
    }>('/api/v6/playlist/detail', { id, n: 100000, s: 8 }, { cookie, crypto: 'eapi' })

    return {
      hasMore: false,
      songCount: res.body.playlist.trackCount,
      songs: res.body.playlist.tracks
    }
  }

  /**
   * 搜索
   */
  static async search({ keywords, limit = 100, page = 0, type = 1 }: SearchQueryType): Promise<SearchResponseType> {
    'use cache'
    cacheLife('days')
    cacheTag(CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

    const cookie = await get<string>(VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE)

    const res = await neteaseRequest<{
      result: {
        songCount: number
        songs: SongDetailResponseType[]
      }
    }>('/api/cloudsearch/pc', { limit, offset: page * limit, s: keywords, total: true, type }, { cookie, crypto: 'eapi' })

    return {
      hasMore: res.body.result.songCount > (page + 1) * limit,
      songCount: res.body.result.songCount,
      songs: res.body.result.songs
    }
  }
}
