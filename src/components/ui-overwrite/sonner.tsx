'use client'

import { useIsMobile } from '@/hooks/use-mobile'

import { Toaster as ShadcnToaster } from '../ui/sonner'

export const Toaster = () => {
  const isMobile = useIsMobile()

  return <ShadcnToaster duration={5000} position={isMobile ? 'top-center' : 'bottom-right'} />
}
