import { Treaty, treaty } from '@elysiajs/eden'
import { isBrowser } from 'es-toolkit'
import { toast } from 'sonner'

import { app } from '@/app/api/[[...elysia]]/route'

import { HEADER_KEY } from '../constants'
import { AesGcm } from './crypto'

const url = isBrowser() ? process.env.NEXT_PUBLIC_WEBSITE_URL : `http://localhost:${process.env.PORT || 3000}`

/**
 * 添加 Eden 来实现类似于 tRPC 的端到端类型安全
 */
export const rpc = treaty<typeof app>(url, {
  onResponse: async response => {
    try {
      const contentType = response.headers.get('Content-Type')

      if (!response.ok) {
        if (contentType?.includes('text/plain')) {
          throw new Error(await response.text())
        }
        if (contentType?.includes('application/json')) {
          throw new Error(JSON.stringify(await response.json()))
        }
        throw new Error(response.statusText)
      }

      // AES-GCM
      const ivJwk = response.headers.get(HEADER_KEY.AES_GCM_IVJWK)
      if (ivJwk && contentType?.includes('application/octet-stream')) {
        const buffer = await response.arrayBuffer()
        return await AesGcm.decrypt(buffer, ivJwk)
      }

      // JSON
      if (contentType?.includes('application/json')) {
        return await response.json()
      }

      // Text
      if (contentType?.includes('text/plain')) {
        return await response.text()
      }

      // Blob
      return await response.blob()
    } catch (error) {
      const message = (error as Error).message

      if (isBrowser()) {
        if (window.location.pathname.startsWith('/dashboard')) {
          toast.error(message, { id: message, richColors: true })
        }
      }

      return Promise.reject(error)
    }
  }
}).api

export const unwrap = <T extends Treaty.TreatyResponse<{}>>({ data, error }: T) => {
  if (error) {
    console.error(error.status, error.value)
    return Promise.reject(new Error(JSON.stringify((error.value as any).message ?? error.value, null, 2)))
  }
  return data as Treaty.Data<T>
}
