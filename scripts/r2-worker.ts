// @ts-nocheck

import { ExportedHandler, R2Bucket, R2Object, R2Objects } from '@cloudflare/workers-types/2023-07-01'

interface Env {
  AUTH_KEY_SECRET: string
  R2: R2Bucket
}

/** 统一响应函数 */
class CustomResponse extends Response {
  constructor(body: BodyInit | null = null, init: ResponseInit = {}) {
    init['headers'] = Object.assign(init.headers || {}, {
      'Access-Control-Allow-Headers': 'X-R2-SECRET, Content-Type',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
      'Access-Control-Allow-Origin': '*',
      Allow: 'GET, PUT, DELETE'
    })
    super(body, init)
  }
}

export default {
  async fetch(request, { R2, AUTH_KEY_SECRET }) {
    // 预请求
    if (request.method == 'OPTIONS') return new CustomResponse()

    const url = new URL(request.url)
    const key = decodeURIComponent(url.pathname.slice(1))

    // 文件直链
    if (request.headers.get('X-R2-SECRET') != AUTH_KEY_SECRET) {
      const res = await R2.get(key)

      if (!res) return new CustomResponse(`${key} Not Found`, { status: 404 })

      const headers = new Headers()
      res.writeHttpMetadata(headers)
      headers.set('etag', res.etag)

      return new CustomResponse(res.body, { headers })
    }

    // CRUD
    let res: R2Object | R2Objects | null = null

    switch (request.method) {
      case 'GET':
        res = await R2.list({
          delimiter: '/',
          include: ['customMetadata', 'httpMetadata'],
          prefix: key || undefined
        })
        break
      case 'PUT':
        const customMetadata = Object.fromEntries(url.searchParams.entries())
        res = await R2.put(key, request.body, {
          customMetadata,
          md5: url.searchParams.get('md5') || ''
        })
        break
      case 'DELETE':
        await R2.delete(key)
        break
      default:
        return new CustomResponse('Method Not Allowed', { status: 405 })
    }

    return new CustomResponse(JSON.stringify(res || {}), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
} satisfies ExportedHandler<Env>
