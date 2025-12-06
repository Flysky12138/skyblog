import { Treaty, treaty } from '@elysiajs/eden'
import { isBrowser, pick } from 'es-toolkit'
import { toast } from 'sonner'

import { app } from '@/app/api/[[...elysia]]/route'

import { HEADER_KEY } from '../constants'
import { AesGcm } from '../crypto'

const url = isBrowser() ? process.env.NEXT_PUBLIC_WEBSITE_URL : `http://localhost:${process.env.PORT || 3000}`

/**
 * 添加 Eden 来实现类似于 tRPC 的端到端类型安全
 */
export const rpc = treaty<typeof app>(url, {
  onResponse: async response => {
    try {
      const contentType = response.headers.get('Content-Type')

      if (!response.ok) {
        // Elysia 接口 Zod 验证错误
        if (contentType?.includes('text/plain')) {
          const text = await response.text()

          const data = (() => {
            try {
              return JSON.parse(text)
            } catch (error) {
              return text
            }
          })()

          if (typeof data == 'object') {
            throw new Error(JSON.stringify(pick(data ?? {}, ['type', 'property', 'on', 'message'])))
          } else {
            throw new Error(JSON.stringify(data.replace(/^\s*/, '')))
          }
        }

        throw new Error(JSON.stringify(response.statusText))
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
      const message = JSON.parse((error as Error).message)

      const text = typeof message == 'string' ? message : JSON.stringify(message, null, 2)

      if (isBrowser()) {
        if (window.location.pathname.startsWith('/dashboard')) {
          toast.error(text, { id: text, richColors: true })
        }
      }

      return Promise.reject(text)
    }
  }
}).api

export const unwrap = <T extends Treaty.TreatyResponse<{}>>({ data, error }: T) => {
  if (error) return Promise.reject(error)
  return data as Treaty.Data<T>
}
