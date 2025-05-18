'use client'

import { debounce } from 'es-toolkit'
import React from 'react'
import { useEvent } from 'react-use'

import { ATTRIBUTE } from '@/lib/constants'
import { isBetween } from '@/lib/parser/number'

interface PostTocWrapperProps extends React.ComponentProps<'section'> {}

/**
 * 设置活跃标题样式
 */
export const PostTocWrapper = ({ ref, ...props }: PostTocWrapperProps) => {
  const tocWrapperRef = React.useRef<HTMLElement>(null)
  const setActiveTocStyle = (activeIndex: number) => {
    const container = tocWrapperRef.current
    if (!container) return
    Array.from(container.querySelectorAll('a[href^="#"]')).forEach((el, i) => {
      activeIndex == i ? el.setAttribute('data-active', '') : el.removeAttribute('data-active')
      if (activeIndex != i) return
      const { offsetHeight: parentHeight, scrollTop } = container
      const { offsetHeight, offsetTop } = el as HTMLElement
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

  return <section ref={tocWrapperRef} {...props} />
}
