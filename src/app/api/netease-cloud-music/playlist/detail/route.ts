import { createRequire } from 'module'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'
import { cacheLife, cacheTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { CacheTag } from '@/lib/cache'
import { CustomResponse } from '@/lib/http/response'

import { getNeteaseCloudMusicCookie } from '../../utils'

const require = createRequire(import.meta.url)
const { playlist_detail } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

const getPlaylistDetail = async (id: string) => {
  'use cache'
  cacheLife('days')
  cacheTag(CacheTag.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

  try {
    const res: any = await playlist_detail({ cookie: await getNeteaseCloudMusicCookie(), id })
    return {
      hasMore: false,
      songCount: res.body.playlist.trackCount,
      songs: res.body.playlist.tracks
    } satisfies GET['return']
  } catch (error) {
    throw new Error((error as any).body.message)
  }
}

export type GET = RouteHandlerType<{
  return: {
    hasMore: boolean
    songCount: number
    songs: {
      al: {
        id: number
        name: string
        picUrl: string
      }
      ar: {
        id: number
        name: string
      }[]
      dt: number
      id: number
      name: string
    }[]
  }
  search: {
    id: number | string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const data = await getPlaylistDetail(id)

    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
