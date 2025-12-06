import { geolocation } from '@vercel/functions'
import { Elysia } from 'elysia'

import { getRealIp } from '@/lib/http/headers'
import { isDev } from '@/lib/utils'

export const ipinfo = new Elysia({ prefix: '/ipinfo' }).get('/', async ({ request, status }) => {
  const ip = isDev() ? '0.0.0.0' : getRealIp(request)
  if (!ip) return status(400, '未知访问')

  try {
    if (!process.env.TOKEN_IPINFO) {
      throw new Error('TOKEN_IPINFO 值缺失')
    }

    const res = await fetch(`https://ipinfo.io/${ip}?token=${process.env.TOKEN_IPINFO}`, {
      next: {
        revalidate: 3600 * 24 * 30
      }
    })

    if (!res.ok) {
      throw new Error('获取 IP 信息失败')
    }

    return await res.json()
  } catch (error) {
    return { ip, ...geolocation(request) }
  }
})
