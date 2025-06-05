import React from 'react'

import { cn } from '@/lib/utils'

export const Li = ({ className, ...props }: React.ComponentProps<'li'>) => {
  return <li className={cn('marker:text-inherit', className)} {...props} />
}
