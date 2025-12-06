import { Treaty, treaty } from '@elysiajs/eden'
import { isBrowser } from 'es-toolkit'

import { app } from '@/app/api/[[...slug]]/route'

const url = isBrowser() ? process.env.NEXT_PUBLIC_WEBSITE_URL : `http://localhost:${process.env.PORT || 3000}`

/**
 * 添加 Eden 来实现类似于 tRPC 的端到端类型安全
 */
export const rpc = treaty<typeof app>(url).api

export function unwrap<T extends Treaty.TreatyResponse<{}>>({ data, error }: T) {
  if (error) throw error
  return data as Treaty.Data<T>
}
