import { auth } from '@/lib/auth'
import { MiddlewareConfig, NextMiddleware, NextResponse, userAgent } from 'next/server'

export const config: MiddlewareConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

export const middleware: NextMiddleware = async (request, event) => {
  if (process.env.NODE_ENV == 'development') return

  const agent = userAgent(request)

  // 封禁华为
  if (['huawei', 'honor', 'harmonyos'].some(device => agent.ua.toLowerCase().includes(device)) || agent.device.vendor?.toLowerCase() == 'huawei') {
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
}
