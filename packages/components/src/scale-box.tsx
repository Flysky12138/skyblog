import { useRender } from '@repo/ui/base'
import React from 'react'

interface ScaleBoxProps extends useRender.ComponentProps<'div'> {
  maxHeight?: number
  maxWidth?: number
  /**
   * 缩放方式
   *
   * `zoom`: use CSS zoom to scale the element\
   * `transform`: use CSS transform to scale the element
   *
   * @default 'zoom'
   */
  scaleType?: 'transform' | 'zoom'
}

export function ScaleBox({ maxHeight, maxWidth, render, scaleType = 'zoom', style, ...props }: ScaleBoxProps) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null)
  const [scale, setScale] = React.useState(1)

  React.useLayoutEffect(() => {
    if (!element) return

    const update = () => {
      const { offsetHeight, offsetWidth } = element

      setScale(Math.min(maxWidth ? maxWidth / offsetWidth : 1, maxHeight ? maxHeight / offsetHeight : 1, 1))
    }

    update()
  }, [element, maxWidth, maxHeight])

  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ref: setElement,
      style: {
        ...style,
        ...(scaleType === 'zoom' ? { zoom: scale } : { transform: `scale(${scale})` })
      },
      ...props
    },
    state: {
      slot: 'scale-box'
    }
  })
}
