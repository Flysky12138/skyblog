'use client'

import React from 'react'

interface StyleProps {
  children: string
}

/**
 * 避免 Next.js 默认使用 `React.Activity` 组件，导致离开组件时样式不移除问题
 */
export function Style({ children }: StyleProps) {
  const styleRef = React.useRef<HTMLStyleElement>(null)

  // React.useInsertionEffect 只会执行一次，应该是 React 的 BUG
  React.useLayoutEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement('style')
      styleRef.current = style
      document.head.append(style)
    }

    styleRef.current.textContent = children

    return () => {
      styleRef.current?.remove()
      styleRef.current = null
    }
  }, [children])

  return null
}
