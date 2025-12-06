'use client'

import { Fancybox } from '@fancyapps/ui'
import React from 'react'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

/**
 * 图片预览
 * @see https://fancyapps.com/fancybox/
 */
export function FancyboxRegister() {
  const itemSelector = '[data-fancybox]'

  React.useEffect(() => {
    Fancybox.bind(itemSelector, {
      Carousel: {
        Toolbar: {
          display: {
            left: ['counter'],
            middle: ['rotateCCW', 'rotateCW', 'flipX', 'flipY', 'reset'],
            right: ['thumbs', 'close']
          }
        }
      },
      theme: 'dark'
    })

    return () => {
      Fancybox.unbind(itemSelector)
    }
  }, [])

  return null
}
