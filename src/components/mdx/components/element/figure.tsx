import React from 'react'

import { cn } from '@/lib/utils'

export const Figure = ({ className, ...props }: React.ComponentProps<'figure'>) => {
  return <figure className={cn('my-5', className)} {...props} />
}
