import { geolocation, ipAddress } from '@vercel/functions'
import { NextRequest } from 'next/server'

import { CustomFetch } from '@/lib/http/fetch'
import { CustomResponse } from '@/lib/http/response'

export const runtime = 'nodejs'

export type GET = RouteHandlerType<{
  return: Record<string, boolean | number | string>
}>

export const GET = async (request: NextRequest) => {
  const ip = process.env.NODE_ENV == 'development' ? '0.0.0.0' : ipAddress(request)
  if (!ip) return CustomResponse.error('未知访问', { status: 400 })

  try {
    if (!process.env.TOKEN_IPINFO) throw new Error()
    const data = await CustomFetch(`https://ipinfo.io/${ip}?token=${process.env.TOKEN_IPINFO}`, {
      next: {
        revalidate: 2592000
      }
    })
    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.encrypt({ ip, ...geolocation(request) })
  }
}
