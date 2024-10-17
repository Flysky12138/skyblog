'use client'

import { ATTRIBUTE } from '@/lib/constants'
import { isBetween } from '@/lib/parser/number'
import { debounce } from '@mui/material'
import React from 'react'
import { useEvent } from 'react-use'

interface PostTocWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function PostTocWrapper({ children, ...props }: PostTocWrapperProps) {
  // 设置活跃标题样式
  const tocContainerRef = React.useRef<HTMLElement>(null)
  const setActiveTocStyle = (activeIndex: number) => {
    const container = tocContainerRef.current
    if (!container) return
    Array.from(container.querySelectorAll('a[href^="#"]')).forEach((el, i) => {
      el.setAttribute('data-active', String(activeIndex == i))
      if (activeIndex != i) return
      const { offsetHeight: parentHeight, scrollTop } = container
      const { offsetTop, offsetHeight } = el as HTMLElement
      if (!isBetween(offsetTop - scrollTop, offsetHeight + 20, parentHeight - offsetHeight - 20)) {
        container.scroll({ behavior: 'smooth', top: offsetTop - parentHeight * 0.5 })
      }
    })
  }

  useEvent(
    'scroll',
    debounce(() => {
      const article = document.getElementById(ATTRIBUTE.ID.POST_CONTAINER)
      if (!article) return
      const rects = Array.from(article.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5,h6'), it => it.getBoundingClientRect())
      const [min, max] = [0, 200]
      for (let i = 0; i < rects.length; i++) {
        if (
          // 第一个标题大于最大范围
          (i == 0 && rects[i].top > max) ||
          // 范围内
          isBetween(rects[i].top, min, max) ||
          // 指定的范围在两标题之间
          (i + 1 < rects.length && rects[i].top < min && rects[i + 1].top > max) ||
          // 最后一个标题小于最小范围
          (i + 1 == rects.length && rects[i].top < min)
        ) {
          setActiveTocStyle(i)
          break
        }
      }
    }, 200)
  )

  return (
    <section ref={tocContainerRef} {...props}>
      {children}
    </section>
  )
}
