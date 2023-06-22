import { auth } from '@/lib/auth'
import { getAll } from '@vercel/edge-config'
import { geolocation, ipAddress } from '@vercel/functions'
import { MiddlewareConfig, NextMiddleware, NextRequest, NextResponse } from 'next/server'
import { EDGE_CONFIG } from './lib/constants'

export const config: MiddlewareConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

const matchUrls = (request: NextRequest, urls: StartsWith<'/'>[]) => urls.some(url => request.nextUrl.pathname.startsWith(url))

export const middleware: NextMiddleware = async (request, event) => {
  if (process.env.NODE_ENV == 'development') return

  const session = await auth()

  // 屏蔽用户
  if (!matchUrls(request, ['/api/clash'])) {
    const url = request.nextUrl.clone()
    url.pathname = '/ban'

    const ip = ipAddress(request)
    const userAgent = request.headers.get('user-agent')

    if (!ip || !userAgent) return NextResponse.rewrite(url)

    const referer = request.headers.get('referer') || 'unknown'
    const { city = '', country = '', countryRegion = '' } = geolocation(request)

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

  // 权限管理
  if (matchUrls(request, ['/dashboard', '/api/dashboard'])) {
    if (session?.role != 'ADMIN') {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('to', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }
}
