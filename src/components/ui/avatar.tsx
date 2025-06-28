'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'

import { cn } from '@/lib/utils'

export const Avatar = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) => {
  return (
    <AvatarPrimitive.Root className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)} data-slot="avatar" {...props} />
  )
}

export const AvatarFallback = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  return (
    <AvatarPrimitive.Fallback
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      data-slot="avatar-fallback"
      {...props}
    />
  )
}

export const AvatarImage = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} data-slot="avatar-image" {...props} />
}
