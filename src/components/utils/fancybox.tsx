'use client'

import { Fancybox } from '@fancyapps/ui'
import React from 'react'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

/**
 * 图片预览
 * @see https://fancyapps.com/fancybox/
 */
export const FancyboxRegister = () => {
  const itemSelector = '[data-fancybox]'

  React.useEffect(() => {
    Fancybox.bind(itemSelector, {
      Carousel: {
        Toolbar: {
          display: {
            left: ['counter'],
            middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY', 'reset'],
            right: ['autoplay', 'thumbs', 'close']
          }
        }
      }
    })

    return () => {
      Fancybox.unbind(itemSelector)
    }
  }, [])

  return null
}
