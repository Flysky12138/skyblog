import { geolocation } from '@vercel/functions'
import { NextRequest } from 'next/server'

import { getRealIp } from '@/lib/http/headers'
import { CustomResponse } from '@/lib/http/response'
import { isDev } from '@/lib/utils'

export type GET = RouteHandlerType<{
  return: Record<string, boolean | number | string>
}>

export const GET = async (request: NextRequest) => {
  const ip = isDev() ? '0.0.0.0' : getRealIp(request)
  if (!ip) return CustomResponse.error('未知访问', { status: 400 })

  try {
    if (!process.env.TOKEN_IPINFO) throw new Error()
    const res = await fetch(`https://ipinfo.io/${ip}?token=${process.env.TOKEN_IPINFO}`, {
      next: {
        revalidate: 3600 * 24 * 30
      }
    })
    const data = await res.json()
    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.encrypt({ ip, ...geolocation(request) })
  }
}
