import { EDGE_CONFIG } from '@/lib/keys'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { get } from '@vercel/edge-config'

export const runtime = 'edge'

export const GET = async () => {
  try {
    const cookie = await get<string>(EDGE_CONFIG.NETEASECLOUD_COOKIE)
    if (!cookie) return CustomResponse.error('{cookie} 值缺失', 400)

    const data = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/login/status?cookie=${cookie}&t=${Date.now()}`)
    if (!data.data.account) return CustomResponse.error('登陆失败')

    return CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
