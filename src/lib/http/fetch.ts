import { cloneDeep, delay, isBrowser } from 'es-toolkit'
import { toast } from 'sonner'

import { HEADER } from '../constants'
import { AesGcm } from '../crypto/aes-gcm'

const Core = async (promise: () => Promise<Response>, retry: number) => {
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

    // text
    if (contentType?.includes('text')) return await res.text()

    // CustomResponse.encrypt 加密
    const ivJwk = res.headers.get(HEADER.AES_GCM_IVJWK)
    if (ivJwk && contentType?.includes('application/octet-stream')) {
      const buffer = await res.arrayBuffer()
      return await AesGcm.decrypt(buffer, ivJwk)
    }

    // blob
    return await res.blob()
  } catch (error) {
    if (retry > 0) {
      await delay(200)
      return Core(promise, retry - 1)
    }
    console.error(error)
    const message = JSON.parse((error as Error).message)
    const formatMessage = typeof message == 'string' ? message : JSON.stringify(message, null, 2)
    if (isBrowser()) {
      if (window.location.pathname.includes('/dashboard')) {
        toast.error(formatMessage, { closeButton: true, richColors: true })
      }
    }
    return Promise.reject(formatMessage)
  }
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

  return Core(async () => fetch(input, { body, headers, ...init }), 3)
}
