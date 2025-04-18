import { POST } from '@/app/api/visitor/route'
import { auth } from '@/lib/auth'
import { COOKIE } from '@/lib/constants'
import { geolocation, ipAddress } from '@vercel/functions'
import { MiddlewareConfig, NextMiddleware, NextResponse, userAgent } from 'next/server'

export const config: MiddlewareConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

export const middleware: NextMiddleware = async (request, event) => {
  if (process.env.NODE_ENV == 'development') return

  /** 访客信息 */
  const visitor: POST['body'] = {
    agent: userAgent(request),
    geo: geolocation(request),
    ip: ipAddress(request) || '',
    referer: request.headers.get('referer')
  }

  // 封禁华为
  if (
    ['huawei', 'honor', 'harmonyos'].some(device => visitor.agent.ua.toLowerCase().includes(device)) ||
    visitor.agent.device.vendor?.toLowerCase() == 'huawei'
  ) {
    return NextResponse.redirect(new URL('/ban', request.url))
  }

  const session = await auth()

  // 权限管理
  if (['/dashboard', '/api/dashboard'].some(url => request.nextUrl.pathname.startsWith(url))) {
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
    request.nextUrl.pathname != '/api/visitor' &&
    !request.cookies.has(COOKIE.VISITED) &&
    !visitor.agent.ua.toLowerCase().includes('vercel')
  ) {
    response.cookies.set(COOKIE.VISITED, 'true', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    event.waitUntil(
      fetch(new URL('/api/visitor', request.url), {
        body: JSON.stringify(visitor),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
    )
  }

  return response
}
