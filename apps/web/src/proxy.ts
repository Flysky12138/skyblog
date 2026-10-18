import { NextProxy, NextResponse, userAgent } from 'next/server'
import z from 'zod'

export const proxy: NextProxy = async request => {
  const agent = userAgent(request)

  // 封禁华为
  if (['huawei', 'honor', 'harmonyos'].some(device => agent.ua.toLowerCase().includes(device)) || agent.device.vendor?.toLowerCase() === 'huawei') {
    return NextResponse.redirect(new URL('/ban', request.url))
  }

  // Token 格式验证，具体权限验证在对应接口和异步页面中处理
  if (['/dashboard', '/api/dashboard'].some(url => request.nextUrl.pathname.startsWith(url))) {
    const hasToken = request.cookies.has('__Secure-neon-auth.session_token')

    if (!hasToken) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    const hasJwt = request.cookies.has('__Secure-neon-auth.local.session_data')
    const jwt = request.cookies.get('__Secure-neon-auth.local.session_data')?.value
    const validJwt = z.validate(z.jwt({ alg: 'HS256' }), jwt)

    if (hasJwt && !validJwt) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
  }

  return NextResponse.next()
}
