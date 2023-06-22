'use client'

import React from 'react'

interface ScrollChildrenClassProps {
  children: React.ReactElement
  className: string
  down?: number
  selector?: string
  up?: number
}

export default function ScrollChildrenClass({ selector, children, className, down = Infinity, up = 0 }: ScrollChildrenClassProps) {
  const childrenRef = React.useRef<HTMLElement>(null)
  const newChildren = React.cloneElement(children, { ref: childrenRef })

  React.useEffect(() => {
    const listener: EventListener = event => {
      const y = (event.target as HTMLElement).scrollTop ?? document.documentElement.scrollTop
      childrenRef.current?.classList[y >= up && y <= down ? 'add' : 'remove'](...className.split(/\s+/))
    }
    const target = selector ? document.querySelector(selector) : document
    target?.addEventListener('scroll', listener)
    return () => {
      target?.removeEventListener('scroll', listener)
    }
  }, [className, down, selector, up])

  return <>{newChildren}</>
}
