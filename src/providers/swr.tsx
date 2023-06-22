'use client'

import { SWRConfig } from 'swr'

import { CustomFetch } from '@/lib/http/fetch'

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
export const SWRProvider = (props: React.ComponentProps<typeof SWRConfig>) => {
  return (
    <SWRConfig
      value={{
        fetcher: url => CustomFetch(url)
      }}
      {...props}
    />
  )
}
