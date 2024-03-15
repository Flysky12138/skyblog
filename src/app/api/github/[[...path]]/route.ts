import { getGithubRepos } from '@/lib/server/github'
import { CustomResponse } from '@/lib/server/response'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// 由于 vercel 限制，大于 4M 就重定向
export const GET = async (request: NextRequest, { params }: DynamicRoute<{ path?: string[] }>) => {
  try {
    const path = params.path?.join('/') || ''

    const data = await getGithubRepos(path)

    if (Array.isArray(data)) return CustomResponse.error('资源响应错误', 504)

    if (data.size >= 4 * 1024 * 1024) return NextResponse.redirect(data.download_url)

    const res = await fetch(data.download_url)
    const blob = await res.blob()
    return new Response(blob, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, s-maxage=2592000, immutable'
      },
      status: res.status,
      statusText: res.statusText
    })
  } catch (error) {
    return CustomResponse.error(error)
  }
}
