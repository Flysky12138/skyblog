import { cn } from '@/lib/utils'
import React from 'react'

export const Figure = ({ className, ...props }: React.ComponentProps<'figure'>) => {
  return <figure className={cn('my-5', className)} {...props} />
}
