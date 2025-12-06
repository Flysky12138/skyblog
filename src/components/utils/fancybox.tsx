'use client'

import { Fancybox } from '@fancyapps/ui'
import React from 'react'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

import { useTheme } from '@/hooks/use-theme'

const itemSelector = '[data-fancybox]'

/**
 * 图片预览
 * @see https://fancyapps.com/fancybox/
 */
export function FancyboxRegister() {
  const { isDark } = useTheme()

  React.useEffect(() => {
    Fancybox.getDefaults().theme = isDark ? 'dark' : 'light'
  }, [isDark])

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
      }
    })

    return () => {
      Fancybox.unbind(itemSelector)
    }
  }, [])

  return null
}
