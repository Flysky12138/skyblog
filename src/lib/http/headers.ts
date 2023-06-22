import { ipAddress } from '@vercel/functions'
import { NextRequest } from 'next/server'

/**
 * 获取用户真实 IP
 */
export const getRealIp = (request: NextRequest) => {
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor

  return ipAddress(request) || ''
}
