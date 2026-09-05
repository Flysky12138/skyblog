'use client'

import { cn } from '@repo/ui/lib/utils'
import { useSelectedLayoutSegments } from 'next/navigation'
import React from 'react'
import z from 'zod'

export function Main({ className, ...props }: React.ComponentProps<'main'>) {
  const segments = useSelectedLayoutSegments()

  const isPostEditPage = z.tuple([z.literal('posts'), z.union([z.literal('create'), z.uuidv7()])]).validate(segments)

  return (
    <main
      className={cn(
        'h-full bg-root p-4 md:p-8',
        {
          'p-0!': isPostEditPage
        },
        className
      )}
      {...props}
    />
  )
}
