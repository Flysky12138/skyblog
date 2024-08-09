'use client'

import { getElementDistanceFromTop } from '@/lib/dom/document'
import { isBetween } from '@/lib/parser/number'
import React from 'react'

interface PostTocWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function PostTocWrapper({ children, ...props }: PostTocWrapperProps) {
  // 获取所有标题距页面顶部距离
  const headingY = React.useRef<number[]>([])
  React.useEffect(() => {
    const article = document.querySelector('article')
    if (!article) return
    headingY.current = Array.from(article.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5,h6')).map(getElementDistanceFromTop)
  }, [])

  const [activeIndex, setActiveIndex] = React.useState(0)

  // 滚动时判断活跃标题的索引
  const offsetY = 100
  React.useEffect(() => {
    const callback: EventListener = event => {
      const target = event.target as HTMLElement
      const scrollTop = target.querySelector('html')?.scrollTop || 0
      const index = Math.max(
        0,
        headingY.current.findLastIndex(_y => _y < scrollTop + offsetY)
      )
      setActiveIndex(index)
    }
    window.addEventListener('scroll', callback)
    return () => {
      window.removeEventListener('scroll', callback)
    }
  }, [])

  // 设置活跃标题样式
  const tocContainerRef = React.useRef<HTMLElement>(null)
  React.useEffect(() => {
    if (!tocContainerRef.current) return
    const container = tocContainerRef.current
    Array.from(container.children).forEach((el, i) => {
      el.setAttribute('data-active', String(activeIndex == i))
      if (activeIndex != i) return
      const { offsetHeight: parentHeight, scrollTop } = container
      const { offsetTop, offsetHeight } = el as HTMLElement
      if (!isBetween(offsetTop - scrollTop, offsetHeight + 20, parentHeight - offsetHeight - 20)) {
        container.scroll({ behavior: 'smooth', top: offsetTop - parentHeight * 0.5 })
      }
    })
  }, [activeIndex])

  return (
    <section ref={tocContainerRef} {...props}>
      {children}
    </section>
  )
}
