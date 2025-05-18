import React from 'react'

import { cn } from '@/lib/utils'

export const P = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return <p className={cn('my-2', className)} {...props} />
}
