'use client'

import { noop } from 'es-toolkit'
import React from 'react'

interface ContentSize {
  bottom: number
  height: number
  left: number
  rects: DOMRect[]
  right: number
  top: number
  width: number
}

interface ContentSizeProps {
  children: React.ReactNode
  onSizeChange?: (size: ContentSize) => void
}

export function ContentSize({ children, onSizeChange }: ContentSizeProps) {
  const ref = React.useRef<React.FragmentInstance>(null)

  const onSizeChangeEvent = React.useEffectEvent(onSizeChange ?? noop)

  React.useLayoutEffect(() => {
    const fragment = ref.current
    if (!fragment) return

    const update = () => {
      const rects = [...fragment.getClientRects()]

      if (!rects.length) {
        onSizeChangeEvent({
          bottom: 0,
          height: 0,
          left: 0,
          rects: [],
          right: 0,
          top: 0,
          width: 0
        })
        return
      }

      const left = Math.min(...rects.map(rect => rect.left))
      const top = Math.min(...rects.map(rect => rect.top))
      const right = Math.max(...rects.map(rect => rect.right))
      const bottom = Math.max(...rects.map(rect => rect.bottom))

      onSizeChangeEvent({
        bottom,
        height: bottom - top,
        left,
        rects,
        right,
        top,
        width: right - left
      })
    }

    update()

    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('resize', update)
    }
  }, [])

  return <React.Fragment ref={ref}>{children}</React.Fragment>
}
