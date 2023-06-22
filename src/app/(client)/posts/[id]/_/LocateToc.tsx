'use client'

import { getElementDistanceFromTop } from '@/lib/dom/getElementDistanceFromTop'
import { SELECTOR } from '@/lib/keys'
import React from 'react'

export default function LocateToc() {
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
    document.querySelectorAll(`#${SELECTOR.IDS.TOC} > *`).forEach((el, i) => {
      el.setAttribute('data-active', String(activeIndex == i))
    })
  }, [activeIndex])

  return null
}
