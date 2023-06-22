import { CacheClear } from '@/lib/cache'
import { EDGE_CONFIG } from '@/lib/constants'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { edgeFetch } from '@/lib/server/vercel-edge'
import { get } from '@vercel/edge-config'
import { NextRequest } from 'next/server'

export const GET = async () => {
  try {
    const cookie = await get<string>(EDGE_CONFIG.NETEASECLOUD_COOKIE)
    if (!cookie) return CustomResponse.error('{cookie} 值缺失', 400)

    // 获取用户信息
    const data1 = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/user/account?cookie=${cookie}`)
    if (data1.message) return CustomResponse.error(data1.message, 502)

    // 获取用户歌单
    const data2 = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/user/playlist?uid=${data1.profile.userId}&limit=300&cookie=${cookie}`)
    if (data2.message) return CustomResponse.error(data2.message, 502)

    // 选择的歌单ID
    const selectId = await get<number>(EDGE_CONFIG.NETEASECLOUD_PLAYLIST_ID)

    return CustomResponse.encrypt({ playlist: data2.playlist, selectId: selectId ?? -1, user: data1.profile })
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export const PATCH = async (request: NextRequest) => {
  try {
    const { id } = await request.json()
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    await edgeFetch([{ key: EDGE_CONFIG.NETEASECLOUD_PLAYLIST_ID, operation: 'upsert', value: id }])

    CacheClear.music()

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
