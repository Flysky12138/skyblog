import { auth } from '@/lib/auth'
import { geolocation, ipAddress } from '@vercel/edge'
import { getAll } from '@vercel/edge-config'
import { NextRequest, NextResponse } from 'next/server'
import { EDGE_CONFIG } from './lib/constants'
import { CustomResponse } from './lib/server/response'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

const matchUrls = (CustomRequest: NextRequest, urls: StartsWith<'/'>[]) => urls.some(url => CustomRequest.nextUrl.pathname.startsWith(url))

export const middleware = async (CustomRequest: NextRequest) => {
  if (process.env.NODE_ENV == 'development') return

  const session = await auth()

  // 屏蔽用户
  if (!matchUrls(CustomRequest, ['/api/clash'])) {
    const url = CustomRequest.nextUrl.clone()
    url.pathname = '/ban'

    const ip = ipAddress(CustomRequest)
    const userAgent = CustomRequest.headers.get('user-agent')

    if (!ip || !userAgent) return NextResponse.rewrite(url)

    const referer = CustomRequest.headers.get('referer') || 'unknown'
    const { city = '', country = '', countryRegion = '' } = geolocation(CustomRequest)

    const edgeConfig = await getAll<Record<(typeof EDGE_CONFIG)[keyof PickStartsWith<typeof EDGE_CONFIG, 'BAN'>], string[] | null>>()

    if (
      edgeConfig[EDGE_CONFIG.BAN_IPS]?.includes(ip) ||
      edgeConfig[EDGE_CONFIG.BAN_CITIES]?.includes(city) ||
      edgeConfig[EDGE_CONFIG.BAN_COUNTRIES]?.includes(country) ||
      edgeConfig[EDGE_CONFIG.BAN_COUNTRY_REGIONS]?.includes(countryRegion) ||
      edgeConfig[EDGE_CONFIG.BAN_AGENTS]?.some(v => userAgent.toLowerCase().includes(v.toLowerCase())) ||
      edgeConfig[EDGE_CONFIG.BAN_REFERERS]?.some(v => referer.toLowerCase().includes(v.toLowerCase()))
    ) {
      return NextResponse.rewrite(url)
    }
  }

  // 网易云音乐 API 拦截
  if (matchUrls(CustomRequest, ['/api/music/neteasecloud', '/api/dashboard/music/neteasecloud'])) {
    if (process.env.API_NETEASECLOUDMUSIC) return
    return CustomResponse.error('缺少环境变量 {API_NETEASECLOUDMUSIC}', 500)
  }

  // 权限管理
  if (matchUrls(CustomRequest, ['/dashboard', '/api/dashboard'])) {
    if (session?.role != 'ADMIN') {
      const url = new URL('/auth/signin', CustomRequest.url)
      url.searchParams.set('to', CustomRequest.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }
}
