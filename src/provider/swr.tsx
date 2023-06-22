'use client'

import { CustomFetch } from '@/lib/server/fetch'
import { SWRConfig } from 'swr'

/**
 * 极速、轻量、可重用的 数据请求
 *
 * - 重复请求去除
 * - 间隔轮询
 * - 数据依赖
 * - 聚焦时重新验证
 * - 网络恢复时重新验证
 * - 本地缓存更新
 * - 智能错误重试
 *
 * @see https://github.com/vercel/swr
 */
export const SWRProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: url => CustomFetch(url)
      }}
    >
      {children}
    </SWRConfig>
  )
}
