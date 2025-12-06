'use client'

import { useIsMobile } from '@/hooks/use-mobile'

import { Toaster as ShadcnToaster } from '../ui/sonner'

/**
 * 移动端与PC端 Toaster 位置不同
 */
export function Toaster() {
  const isMobile = useIsMobile()

  return <ShadcnToaster duration={5000} position={isMobile ? 'top-center' : 'bottom-right'} />
}
