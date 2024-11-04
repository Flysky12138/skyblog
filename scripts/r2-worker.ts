import { BodyInit, ExportedHandler, Headers as HeadersType, R2Bucket, R2Object, R2Objects, Request } from '@cloudflare/workers-types/2023-07-01'

interface Env {
  AUTH_KEY_SECRET: string
  R2: R2Bucket
}

/** 统一响应函数 */
class CustomResponse extends Response {
  constructor(request: Request, body: BodyInit | null = null, init: ResponseInit = {}) {
    init.headers = Object.assign({}, init.headers, {
      'Access-Control-Allow-Headers': 'X-R2-SECRET, Content-Type',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
      Allow: 'GET, PUT, DELETE'
    })

    const ALLOW_ORIGINS = ['https://blog.flysky.xyz', 'http://localhost:3000']

    const origin = request.headers.get('Origin') || ''
    if (ALLOW_ORIGINS.some(it => origin.startsWith(it))) {
      Reflect.set(init.headers, 'Access-Control-Allow-Origin', origin)
    }

    // @ts-ignore
    super(body, init)
  }
}

export default {
  // @ts-ignore
  fetch: async (request, { R2, AUTH_KEY_SECRET }) => {
    try {
      // 预请求
      if (request.method == 'OPTIONS') return new CustomResponse(request)

      const url = new URL(request.url)
      const key = decodeURIComponent(url.pathname.slice(1))

      // 文件直链
      if (request.headers.get('X-R2-SECRET') != AUTH_KEY_SECRET) {
        const res = await R2.get(key)

        if (!res) return new CustomResponse(request, `${key} Not Found`, { status: 404 })

        if (request.headers.get('If-None-Match') == res.etag) return new CustomResponse(request, null, { status: 304 })

        const headers = new Headers() as unknown as HeadersType
        res.writeHttpMetadata(headers)

        return new CustomResponse(request, res.body, {
          headers: {
            ...headers,
            'Cache-Control': 'public, max-age=2592000, immutable', // 缓存一个月，过期后再重新验证
            ETag: res.etag
          }
        })
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
          const formData = await request.formData()
          const { key: _key, blob, metadata, sha1 = '' } = Object.fromEntries(formData) as Record<string, string>
          res = await R2.put(_key, blob, { sha1, customMetadata: JSON.parse(metadata) })
          break
        case 'DELETE':
          await R2.delete(key)
          break
        default:
          return new CustomResponse(request, 'Method Not Allowed', { status: 405 })
      }

      return new CustomResponse(request, JSON.stringify(res || {}), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      return new CustomResponse(request, (error as Error).message, {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 500
      })
    }
  }
} satisfies ExportedHandler<Env>
