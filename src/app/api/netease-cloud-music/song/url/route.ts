import { createRequire } from 'module'
import NeteaseCloudMusicApi, { SoundQualityType } from 'NeteaseCloudMusicApi'
import { cacheLife, cacheTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { CacheTag } from '@/lib/cache'
import { CustomResponse } from '@/lib/http/response'

import { getNeteaseCloudMusicCookie } from '../../utils'

const require = createRequire(import.meta.url)
const { song_url_v1 } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

const getSongUrl = async (id: string, level: SoundQualityType) => {
  'use cache'
  cacheLife('max')
  cacheTag(CacheTag.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)

  try {
    const res: any = await song_url_v1({ cookie: await getNeteaseCloudMusicCookie(), id, level })
    return res.body.data
  } catch (error) {
    throw new Error((error as any).body.message)
  }
}

export type GET = RouteHandlerType<{
  return: {
    encodeType: string
    id: number
    level: NonNullable<GET['search']['level']>
    md5: string
    size: number
    time: number
    type: string
    url: string
  }[]
  search: {
    id: number
    /**
     * `standard` => 标准 \
     * `higher`   => 较高 \
     * `exhigh`   => 极高 \
     * `lossless` => 无损 \
     * `hires`    => Hi-Res \
     * `jyeffect` => 高清环绕声 \
     * `sky`      => 沉浸环绕声 \
     * `jymaster` => 超清母带
     *
     * @default 'jymaster'
     */
    level?: 'exhigh' | 'higher' | 'hires' | 'jyeffect' | 'jymaster' | 'lossless' | 'sky' | 'standard'
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    const level = (request.nextUrl.searchParams.get('level') || 'jymaster') as SoundQualityType

    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const data = await getSongUrl(id, level)

    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
