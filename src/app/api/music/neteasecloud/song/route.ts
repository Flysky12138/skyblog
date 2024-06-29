import { EDGE_CONFIG } from '@/lib/constants'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { ipAddress } from '@vercel/edge'
import { get } from '@vercel/edge-config'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export type GET = MethodRequestType<{
  search: {
    id: number
  }
  return: {
    url: string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const cookie = await get<string>(EDGE_CONFIG.NETEASECLOUD_COOKIE)
    if (!cookie) return CustomResponse.error('{cookie} 值缺失', 400)

    const ip = ipAddress(request) || '125.70.91.151'

    // 验证可用性
    const data1 = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/check/music?id=${id}&cookie=${cookie}&realIP=${ip}`)
    if (data1.message != 'ok') return CustomResponse.error(data1.message, 502)

    // 从网易获取歌曲
    const data2 = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/song/url/v1?id=${id}&level=higher&cookie=${cookie}&realIP=${ip}`)
    const { url } = data2.data[0]
    if (!url) return CustomResponse.error('未找到资源', 404)

    return CustomResponse.encrypt({ url: url.replace('http:', 'https:') })
  } catch (error) {
    return CustomResponse.error(error)
  }
}
