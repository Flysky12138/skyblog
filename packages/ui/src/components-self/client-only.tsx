'use client'

import { useMounted } from '@repo/react-hooks'
import React from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  /**
   * 可选，在服务端渲染时显示的回退内容
   *
   * @default null
   */
  fallback?: React.ReactNode
}

/**
 * 仅在客户端渲染子元素，避免 hydration 不匹配。
 *
 * 适用于包裹依赖浏览器 API、localStorage
 * 或服务端与客户端行为不一致的第三方库的组件。
 */
export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const isMounted = useMounted()

  if (!isMounted) {
    return fallback ?? null
  }

  return children
}
