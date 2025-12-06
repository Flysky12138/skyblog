import { geolocation, ipAddress } from '@vercel/functions'
import { userAgent } from 'next/server'

import { Prisma } from '@/generated/prisma/client'

/**
 * 获取用户真实 IP
 */
export const getRealIp = (request: Request) => {
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor

  return ipAddress(request) || ''
}

/**
 * 获取用户访问信息
 */
export const getUserVisitInfo = (request: Request): Prisma.ActivityLogCreateInput => {
  const agent = userAgent(request)
  const geo = geolocation(request)

  return {
    agent,
    browser: agent.browser.name,
    countryCode: geo.country,
    geo,
    ip: getRealIp(request),
    os: agent.os.name,
    referer: request.headers.get('referer')
  }
}
