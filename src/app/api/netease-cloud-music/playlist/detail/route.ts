import { get } from '@vercel/edge-config'
import { createRequire } from 'module'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'
import { NextRequest } from 'next/server'

import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { CustomResponse } from '@/lib/http/response'

const require = createRequire(import.meta.url)
const { playlist_detail } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

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
    if (!id) return await CustomResponse.error('{id} 值缺失', 400)

    const data = await playlist_detail({
      cookie: await get(VERCEL_EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE),
      id
    })
      .then((res: any) => {
        return {
          hasMore: false,
          songCount: res.body.playlist.trackCount,
          songs: res.body.playlist.tracks
        } satisfies GET['return']
      })
      .catch(error => Promise.reject(error.body.message))

    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
