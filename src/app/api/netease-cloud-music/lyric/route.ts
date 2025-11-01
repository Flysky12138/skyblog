import { createRequire } from 'module'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'
import { cacheLife, cacheTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { CacheTag } from '@/lib/cache'
import { CustomResponse } from '@/lib/http/response'

import { getNeteaseCloudMusicCookie } from '../utils'
import { parseLyric } from './utils'

const require = createRequire(import.meta.url)
const { lyric } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

const getLyric = async (id: string) => {
  'use cache'
  cacheLife('max')
  cacheTag(CacheTag.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

  try {
    const res: any = await lyric({ cookie: await getNeteaseCloudMusicCookie(), id })
    return {
      lrc: parseLyric(res.body.lrc.lyric)!
    } satisfies GET['return']
  } catch (error) {
    throw new Error((error as any).body.message)
  }
}

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

    const data = await getLyric(id)

    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
