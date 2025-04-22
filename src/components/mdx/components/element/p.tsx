import { cn } from '@/lib/utils'
import React from 'react'

export const P = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return <p className={cn('my-2', className)} {...props} />
}
