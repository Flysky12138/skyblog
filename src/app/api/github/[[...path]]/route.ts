import { getGithubRepos } from '@/lib/server/github'
import { CustomResponse } from '@/lib/server/response'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 由于 vercel 限制，大于 4M 就重定向
export const GET = async (request: NextRequest, { params }: DynamicRoute<{ path?: string[] }>) => {
  try {
    const path = params.path?.join('/') || ''
    const data = await getGithubRepos(path)

    if (Array.isArray(data)) return CustomResponse.error('资源响应错误', 504)

    if (data.size >= 4 * 1024 * 1024) {
      const url = process.env.CDN_URL ? `${process.env.CDN_URL}/${data.download_url}` : data.download_url
      return NextResponse.redirect(url, {
        headers: {
          'Cache-Control': 'private, max-age=31536000, immutable'
        }
      })
    }

    const { body } = await fetch(data.download_url)
    return new Response(body, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, s-maxage=2592000, immutable'
      }
    })
  } catch (error) {
    return CustomResponse.error(error)
  }
}
