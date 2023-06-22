'use client'

import { cn } from '@/lib/cn'
import React from 'react'
import { useWindowScroll } from 'react-use'

export const Header = ({ className, ...props }: React.ComponentProps<'header'>) => {
  const { y } = useWindowScroll()

  return (
    <header
      className={cn('z-header h-header bg-root/80 border-divide fixed inset-x-0 top-0 border-b backdrop-blur-sm transition-shadow', className, {
        'shadow-md': y > 40
      })}
      {...props}
    />
  )
}
