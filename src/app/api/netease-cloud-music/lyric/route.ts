import { get } from '@vercel/edge-config'
import { createRequire } from 'module'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'
import { NextRequest } from 'next/server'

import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { CustomResponse } from '@/lib/http/response'

import { parseLyric } from './utils'

export const revalidate = 2592000

const require = createRequire(import.meta.url)
const { lyric } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

export type GET = RouteHandlerType<{
  return: {
    lrc: {
      lyric: string
      time: number
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

    const data = await lyric({
      cookie: await get(VERCEL_EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE),
      id
    })
      .then((res: any) => ({
        lrc: parseLyric(res.body.lrc.lyric)
      }))
      .catch(error => Promise.reject(error.body.message))

    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
