'use client'

import React from 'react'

interface StyleProps {
  children: string
}

/**
 * 避免 Next.js 默认使用 `React.Activity` 组件，导致离开组件时样式不移除问题
 */
export const Style = ({ children }: StyleProps) => {
  const id = React.useId()

  React.useLayoutEffect(() => {
    const style = document.createElement('style')
    style.id = id
    style.textContent = children

    document.head.append(style)

    return () => {
      document.getElementById(id)?.remove()
    }
  }, [children, id])

  return null
}
