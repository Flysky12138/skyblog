import { Treaty, treaty } from '@elysiajs/eden'
import { toast } from '@repo/ui/base'
import { isBrowser } from 'es-toolkit'

import { app } from '@/app/api/[[...elysia]]/route'

import { HEADER_KEY } from '../constants'
import { isDev } from '../utils'
import { AesGcm } from './crypto'

const url = isBrowser() || !isDev() ? process.env.NEXT_PUBLIC_WEBSITE_URL : `http://localhost:${process.env.PORT ?? 3000}`

/**
 * 添加 Eden 来实现类似于 tRPC 的端到端类型安全
 */
export const rpc = treaty<typeof app>(url, {
  onResponse: async response => {
    const ivJwk = response.headers.get(HEADER_KEY.AES_GCM_IVJWK)
    const contentType = response.headers.get('Content-Type')

    if (ivJwk && contentType?.includes('application/octet-stream')) {
      const buffer = await response.arrayBuffer()
      return AesGcm.decrypt(buffer, ivJwk)
    }
  }
}).api

export function unwrap<T extends Treaty.TreatyResponse<{}>>({ data, error }: T) {
  if (error) {
    console.error(error.status, error.value)

    const message = typeof error.value === 'string' ? error.value : JSON.stringify(error.value, null, 2)

    if (isBrowser() && location.pathname.startsWith('/dashboard')) {
      toast.error(message, {
        closeButton: true,
        richColors: true
      })
    }

    throw new Error(message)
  }
  return data as Treaty.Data<T>
}
