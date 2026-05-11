'use client'

import { Toaster as Sonner } from '../components/sonner'
import { useIsMobile } from '../hooks/use-mobile'
import { cn } from '../lib/utils'

/**
 * 移动端与PC端 Toaster 位置不同
 */
export function Toaster() {
  const isMobile = useIsMobile()

  return (
    <Sonner
      duration={5000}
      expand={!isMobile}
      position={isMobile ? 'top-center' : 'bottom-right'}
      toastOptions={{
        classNames: {
          error: cn('whitespace-pre-wrap')
        }
      }}
    />
  )
}
