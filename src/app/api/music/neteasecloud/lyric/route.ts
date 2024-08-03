import { LyricModeType, LyricType } from '@/components/music'
import { parseLyric } from '@/lib/parser/lyric'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export type GET = MethodRequestType<{
  return: Partial<Record<LyricModeType, LyricType[] | null>>
  search: {
    id: number
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/lyric?id=${id}`)
    if (!data.lrc?.lyric) return CustomResponse.error('未找到资源', 404)

    return CustomResponse.encrypt({
      klyric: null,
      // klyric: parseLyric(data.klyric.lyric),
      lrc: parseLyric(data.lrc.lyric),
      romalrc: parseLyric(data.romalrc.lyric),
      tlyric: parseLyric(data.tlyric.lyric)
    })
  } catch (error) {
    return CustomResponse.error(error)
  }
}
