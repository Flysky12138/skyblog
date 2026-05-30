import { NextProxy, NextResponse, userAgent } from 'next/server'

import { authServer } from '@/lib/auth/server'

import { isDev } from './lib/utils'

export const config = {
  matcher: '/((?!_next/data|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
}

export const proxy: NextProxy = async request => {
  if (isDev()) {
    return NextResponse.next()
  }

  const { data: session } = await authServer.getSession()

  const agent = userAgent(request)

  if (
    session?.user.banned ||
    // 封禁华为
    ['huawei', 'honor', 'harmonyos'].some(device => agent.ua.toLowerCase().includes(device)) ||
    agent.device.vendor?.toLowerCase() === 'huawei'
  ) {
    return NextResponse.redirect(new URL('/ban', request.url))
  }

  // 权限管理
  if (['/dashboard', '/api/dashboard'].some(url => request.nextUrl.pathname.startsWith(url))) {
    if (session?.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}
