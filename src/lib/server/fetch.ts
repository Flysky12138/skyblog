import { HEADER } from '@/lib/keys'
import { toast } from 'sonner'
import { decrypt } from '../crypto/aes-gcm'

const Core = async (promise: () => Promise<Response>) => {
  try {
    const res = await promise()

    const contentType = res.headers.get('Content-Type')

    // json
    if (contentType?.includes('application/json')) {
      const data = await res.json()
      if (res.ok) return data
      if ('message' in data) throw new Error(JSON.stringify(data.message)) // CustomResponse.error 抛出的错误
      throw new Error(JSON.stringify(data)) // trycatch 抛出的错误，如 prisma 请求错误
    }

    if (!res.ok) throw new Error(`error code ${res.status}`)

    // CustomResponse.encrypt 加密
    const ivJwk = res.headers.get(HEADER.AES_GCM_IVJWK)
    if (ivJwk && contentType?.includes('application/octet-stream')) {
      const buffer = await res.arrayBuffer()
      return await decrypt(buffer, ivJwk)
    }

    // text
    if (contentType?.includes('text')) return await res.text()

    // blob
    return await res.blob()
  } catch (error) {
    console.error(error)
    const message = JSON.parse((error as Error).message)
    const formatMessage = typeof message == 'string' ? message : JSON.stringify(message, null, '  ')
    if (typeof window != 'undefined') {
      if (window.location.pathname.includes('/dashboard')) {
        toast.error(formatMessage)
      }
    }
    return Promise.reject(formatMessage)
  }
}

interface Request extends Omit<RequestInit, 'method' | 'headers' | 'body'> {
  body?: any
  headers?: Record<string, string>
  method?: 'POST' | 'DELETE' | 'GET' | 'PUT' | 'PATCH' | 'HEAD'
}

export const CustomFetch = async <T = any>(input: RequestInfo | URL, { body, headers = {}, ...init }: Request = {}): Promise<T> => {
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
  if (headers['Content-Type'].includes('application/json')) body = JSON.stringify(body)

  if (typeof input == 'string') {
    input = input.replace(/(?<!:)\/{2,}/g, '/')
    if (input.endsWith('/')) input = input.slice(0, -1)
  }

  return Core(async () => await fetch(input, { body, headers, ...init }))
}
