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

  const id = React.useId()

  React.useLayoutEffect(() => {
    const style = document.createElement('style')
    styleRef.current = style

    style.id = id

    document.head.append(style)

    return () => {
      styleRef.current?.remove()
      styleRef.current = null
    }
  }, [id])

  // 内容更新：就地写入 textContent，保持元素在 <head> 中的位置（层叠顺序）稳定
  React.useLayoutEffect(() => {
    if (styleRef.current) {
      styleRef.current.textContent = children
    }
  }, [children])

  return null
}
