import { get } from '@vercel/edge-config'
import { createRequire } from 'module'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'
import { NextRequest } from 'next/server'

import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { CustomResponse } from '@/lib/http/response'

export const revalidate = 43200

const require = createRequire(import.meta.url)
const { cloudsearch } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

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
    keywords: string
    /**
     * @default 100
     */
    limit?: number
    /**
     * @default 0
     */
    page?: number
    /**
     * 1: 单曲\
     * 10: 专辑\
     * 100: 歌手\
     * 1000: 歌单\
     * 1002: 用户\
     * 1004: MV\
     * 1006: 歌词\
     * 1009: 电台\
     * 1014: 视频\
     * 1018: 综合
     * @default 1
     */
    type?: 1 | 10 | 100 | 1000 | 1002 | 1004 | 1006 | 1009 | 1014 | 1018
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const keywords = request.nextUrl.searchParams.get('keywords')
    if (!keywords) return await CustomResponse.error('{keywords} 值缺失', { status: 400 })

    const limit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '100')
    const page = Number.parseInt(request.nextUrl.searchParams.get('page') || '0')
    const type = Number.parseInt(request.nextUrl.searchParams.get('type') || '1') as 1

    const data = await cloudsearch({
      cookie: await get(VERCEL_EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE),
      keywords,
      limit,
      offset: page * limit,
      type
    })
      .then((res: any) => {
        return {
          hasMore: res.body.result.songCount > (page + 1) * limit,
          songCount: res.body.result.songCount,
          songs: res.body.result.songs
        } satisfies GET['return']
      })
      .catch(error => Promise.reject(error.body.message))

    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
