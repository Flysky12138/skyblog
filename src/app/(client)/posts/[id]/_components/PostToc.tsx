'use client'

import { SELECTOR } from '@/lib/constants'
import { getElementDistanceFromTop } from '@/lib/dom/getElementDistanceFromTop'
import { isBetween } from '@/lib/parser/number'
import React from 'react'

export default function PostToc() {
  const offsetTop = React.useRef<number[]>([])

  React.useEffect(() => {
    const article = document.querySelector('article')
    if (!article) return
    offsetTop.current = Array.from(article.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5,h6')).map(getElementDistanceFromTop)
  }, [])

  const [activeIndex, setActiveIndex] = React.useState(0)

  const offset = 100
  React.useEffect(() => {
    const callback: EventListener = event => {
      const target = event.target as HTMLElement
      const scrollTop = target.querySelector('html')?.scrollTop || 0
      const index = Math.max(
        0,
        offsetTop.current.findLastIndex(offsetTop => offsetTop < scrollTop + offset)
      )
      setActiveIndex(index)
    }
    window.addEventListener('scroll', callback)
    return () => {
      window.removeEventListener('scroll', callback)
    }
  }, [])

  React.useEffect(() => {
    document.querySelectorAll<HTMLHeadingElement>(`#${SELECTOR.IDS.TOC} > *`).forEach((el, i) => {
      if (activeIndex == i) {
        const parentElement = el.parentElement!
        const { offsetHeight: parentHeight, scrollTop } = parentElement
        const { offsetTop, offsetHeight } = el
        if (!isBetween(offsetTop - scrollTop, offsetHeight + 20, parentHeight - offsetHeight - 20)) {
          parentElement.scroll({ behavior: 'smooth', top: offsetTop - parentHeight * 0.5 })
        }
      }
      el.setAttribute('data-active', String(activeIndex == i))
    })
  }, [activeIndex])

  return null
}
