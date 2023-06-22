'use client'

import { useIsMobile } from '@/hooks/use-mobile'

import * as ToasterPrimitive from '../ui/sonner'

export const Toaster = () => {
  const isMobile = useIsMobile()

  return <ToasterPrimitive.Toaster duration={5000} position={isMobile ? 'top-center' : 'bottom-right'} />
}
