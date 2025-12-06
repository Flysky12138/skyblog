import { cloneDeep, delay, isBrowser } from 'es-toolkit'
import { toast } from 'sonner'

import { HEADER_KEY } from '../constants'
import { AesGcm, sha256 } from '../crypto'

const core = async (promise: () => Promise<Response>, retry: number) => {
  try {
    const res = await promise()

    const contentType = res.headers.get('Content-Type')

    // json
    if (contentType?.includes('application/json')) {
      const data = await res.json()
      if (res.ok) {
        return data
      }
      if ('message' in data) {
        throw new Error(JSON.stringify(data.message)) // CustomResponse.error 抛出的错误
      }
      throw new Error(JSON.stringify(data)) // trycatch 抛出的错误，如 prisma 请求错误
    }

    if (!res.ok) {
      throw new Error(`error code ${res.status}`)
    }

    // text
    if (contentType?.includes('text')) {
      return await res.text()
    }

    // CustomResponse.encrypt 加密
    const ivJwk = res.headers.get(HEADER_KEY.AES_GCM_IVJWK)
    if (ivJwk && contentType?.includes('application/octet-stream')) {
      const buffer = await res.arrayBuffer()
      return await AesGcm.decrypt(buffer, ivJwk)
    }

    // blob
    return await res.blob()
  } catch (error) {
    if (retry > 1) {
      await delay(200)
      return core(promise, retry - 1)
    }
    console.error(error)
    const text = JSON.parse((error as Error).message)
    const message = typeof text == 'string' ? text : JSON.stringify(text, null, 2)
    if (isBrowser()) {
      if (window.location.pathname.startsWith('/dashboard')) {
        const id = await sha256(message)
        toast.error(message, { closeButton: true, id, richColors: true })
      }
    }
    return Promise.reject(message)
  }
}

interface FetchOptions extends Omit<RequestInit, 'body' | 'headers' | 'method'> {
  body?: any
  headers?: Record<string, string>
  method?: Method
}

/**
 * 封装的基础请求方法
 */
export const CustomFetch = async <T = any>(input: RequestInfo | URL, { body, headers = {}, ...init }: FetchOptions = {}): Promise<T> => {
  headers = cloneDeep(headers) // 避免修改原对象

  if (!(body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }
    if (headers['Content-Type'].includes('application/json')) {
      body = JSON.stringify(body)
    }
  }

  if (typeof input == 'string') {
    input = input.replace(/(?<!:)\/{2,}/g, '/')
    if (input.endsWith('/')) {
      input = input.slice(0, -1)
    }
  }

  return core(async () => {
    return fetch(input, {
      body,
      headers,
      // signal: AbortSignal.timeout(5000),
      ...init
    })
  }, 3)
}
