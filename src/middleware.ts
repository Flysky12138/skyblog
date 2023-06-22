import { POST } from '@/app/api/visitor/route'
import { auth } from '@/lib/auth'
import { COOKIE } from '@/lib/constants'
import { geolocation, ipAddress } from '@vercel/functions'
import { MiddlewareConfig, NextMiddleware, NextRequest, NextResponse, userAgent } from 'next/server'

export const config: MiddlewareConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

/** 匹配路由 */
const matchUrls = (request: NextRequest, urls: StartsWith<'/'>[]) => urls.some(url => request.nextUrl.pathname.startsWith(url))

export const middleware: NextMiddleware = async (request, event) => {
  if (process.env.NODE_ENV == 'development') return

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

  /** 访客信息 */
  const visitor: POST['body'] = {
    agent: userAgent(request),
    geo: geolocation(request),
    ip: ipAddress(request) || '',
    referer: request.headers.get('referer')
  }

  // 记录访客信息
  if (
    session?.role != 'ADMIN' &&
    request.nextUrl.pathname != '/api/visitor' &&
    !request.cookies.has(COOKIE.VISITED) &&
    !visitor.agent.ua.toLowerCase().includes('vercel')
  ) {
    response.cookies.set(COOKIE.VISITED, Date.now().toString(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    event.waitUntil(fetch(new URL('/api/visitor', request.url), { body: JSON.stringify(visitor), method: 'POST' }))
  }

  return response
}
