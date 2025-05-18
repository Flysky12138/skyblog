import React from 'react'

import { cn } from '@/lib/utils'

export const Ul = ({ className, ...props }: React.ComponentProps<'ul'>) => {
  return <ul className={cn('[&_ul]:list-[circle]', className)} {...props} />
}
