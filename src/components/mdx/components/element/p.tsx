import { cn } from '@/lib/cn'
import React from 'react'

export const P = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return <p className={cn('my-2', className)} {...props} />
}
