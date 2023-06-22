import { EDGE_CONFIG } from '@/lib/constants'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { edgeFetch } from '@/lib/server/vercel-edge'
import { NextRequest } from 'next/server'

export type GET = MethodRequestType<{
  search: {
    password_captcha: string
    phone: string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const phone = request.nextUrl.searchParams.get('phone')
    if (!phone) return CustomResponse.error('{phone} 值缺失', 422)

    const password_captcha = request.nextUrl.searchParams.get('password_captcha')
    if (!password_captcha) return CustomResponse.error('{password_captcha} 值缺失', 422)

    // 获取 cookie
    const search = new URLSearchParams(`phone=${phone}`)
    search.set(/^\d{4}$/.test(password_captcha) ? 'captcha' : 'password', password_captcha)

    const data = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/login/cellphone?${search.toString()}`)
    if (!data.cookie) return CustomResponse.error(data.message, 502)

    // 保存到 edge-config 上
    await edgeFetch([{ key: EDGE_CONFIG.NETEASECLOUD_COOKIE, operation: 'upsert', value: encodeURIComponent(data.cookie) }])

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
