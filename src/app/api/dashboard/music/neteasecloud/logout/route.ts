import { EDGE_CONFIG } from '@/lib/constants'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { edgeFetch } from '@/lib/server/vercel-edge'
import { get } from '@vercel/edge-config'
import { NextRequest } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const cookie = await get<string>(EDGE_CONFIG.NETEASECLOUD_COOKIE)
    if (!cookie) return CustomResponse.error('{cookie} 值缺失', 400)

    const data = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/logout?cookie=${cookie}`)
    if (data.code != 200) return CustomResponse.error('退出登陆失败')

    await edgeFetch([{ key: EDGE_CONFIG.NETEASECLOUD_COOKIE, operation: 'delete', value: '' }])

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
