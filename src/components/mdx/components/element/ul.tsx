import { cn } from '@/lib/utils'
import React from 'react'

export const Ul = ({ className, ...props }: React.ComponentProps<'ul'>) => {
  return <ul className={cn('[&_ul]:list-[circle]', className)} {...props} />
}
