import { NextProxy, NextResponse, userAgent } from 'next/server'

import { auth } from '@/lib/auth'
import { isDev } from '@/lib/utils'

export const proxy: NextProxy = async request => {
  if (isDev()) return

  const agent = userAgent(request)

  // 封禁华为
  if (['huawei', 'honor', 'harmonyos'].some(device => agent.ua.toLowerCase().includes(device)) || agent.device.vendor?.toLowerCase() == 'huawei') {
    return NextResponse.redirect(new URL('/ban', request.url))
  }

  // 权限管理
  if (['/dashboard', '/api/dashboard'].some(url => request.nextUrl.pathname.startsWith(url))) {
    const session = await auth()
    if (session?.role != 'ADMIN') {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('to', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }
}
