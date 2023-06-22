import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { NextRequest } from 'next/server'

export type GET = MethodRequestType<{
  return: {
    status: 'ok'
  }
  search: {
    phone: string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const phone = request.nextUrl.searchParams.get('phone')
    if (!phone) return CustomResponse.error('{phone} 值缺失', 422)

    const data = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/captcha/sent?phone=${phone}&t=${Date.now()}`)
    if (data.message) return CustomResponse.error(data.message, 502)

    return CustomResponse.encrypt({ status: 'ok' })
  } catch (error) {
    return CustomResponse.error(error)
  }
}
