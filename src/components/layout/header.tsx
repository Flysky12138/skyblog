'use client'

import React from 'react'
import { useWindowScroll } from 'react-use'

import { cn } from '@/lib/utils'

export const Header = ({ className, ...props }: React.ComponentProps<'header'>) => {
  const { y } = useWindowScroll()

  return (
    <header
      suppressHydrationWarning
      className={cn(
        'z-header h-header dark:bg-root/80 border-divide fixed inset-x-0 top-0 border-b bg-white backdrop-blur-sm transition-shadow',
        className,
        {
          'shadow-md': y > 40
        }
      )}
      {...props}
    />
  )
}
