'use client'

import { cn } from '@repo/ui/lib/utils'
import React from 'react'
import { useWindowScroll } from 'react-use'

export function Header({ className, ...props }: React.ComponentProps<'header'>) {
  const { y } = useWindowScroll()

  return (
    <header
      suppressHydrationWarning
      className={cn(
        'h-header fixed inset-x-0 top-0 z-50 border-b border-divide bg-white backdrop-blur-sm transition-shadow dark:bg-root/80',
        className,
        {
          'shadow-md': y > 40
        }
      )}
      {...props}
    />
  )
}
