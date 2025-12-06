'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { tw } from '@/lib/utils'

import { Toaster as ShadcnToaster } from '../ui/sonner'

/**
 * 移动端与PC端 Toaster 位置不同
 */
export function Toaster() {
  const isMobile = useIsMobile()

  return (
    <ShadcnToaster
      duration={5000}
      expand={!isMobile}
      position={isMobile ? 'top-center' : 'bottom-right'}
      toastOptions={{
        classNames: {
          error: tw`whitespace-pre-wrap`
        }
      }}
    />
  )
}
