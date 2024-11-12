import { POST } from '@/app/api/visitor/route'
import { auth } from '@/lib/auth'
import { COOKIE, EDGE_CONFIG } from '@/lib/constants'
import { getAll } from '@vercel/edge-config'
import { geolocation, ipAddress } from '@vercel/functions'
import { MiddlewareConfig, NextMiddleware, NextRequest, NextResponse, userAgent } from 'next/server'

export const config: MiddlewareConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

const matchUrls = (request: NextRequest, urls: StartsWith<'/'>[]) => urls.some(url => request.nextUrl.pathname.startsWith(url))

export const middleware: NextMiddleware = async (request, event) => {
  if (process.env.NODE_ENV == 'development') return

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
      edgeConfig[EDGE_CONFIG.BAN_AGENTS]?.some(it => userAgent.toLowerCase().includes(it.toLowerCase())) ||
      edgeConfig[EDGE_CONFIG.BAN_REFERERS]?.some(it => referer.toLowerCase().includes(it.toLowerCase()))
    ) {
      return NextResponse.rewrite(url)
    }
  }

  const session = await auth()

  // 权限管理
  if (matchUrls(request, ['/dashboard', '/api/dashboard'])) {
    if (session?.role != 'ADMIN') {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('to', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  const response = NextResponse.next()

  // 记录访客信息
  if (
    session?.role != 'ADMIN' &&
    !request.headers.has('x-vercel-forwarded-for') &&
    request.nextUrl.pathname != '/api/visitor' &&
    request.cookies.get(COOKIE.VISITED)?.value != 'true'
  ) {
    response.cookies.set(COOKIE.VISITED, 'true', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    // vercel 部署限制（大小、Edge运行时等），所以使用下面的方法
    event.waitUntil(
      fetch(new URL('/api/visitor', request.url), {
        body: JSON.stringify({
          agent: userAgent(request),
          geo: geolocation(request),
          ip: ipAddress(request) || '',
          referer: request.headers.get('referer')
        } satisfies POST['body']),
        method: 'POST'
      })
    )
  }

  return response
}
