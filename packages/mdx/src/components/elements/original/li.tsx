import { cn } from '@repo/ui/lib/utils'
import React from 'react'

export function Li({ className, ...props }: React.ComponentProps<'li'>) {
  const isTaskItem = className?.includes('task-list-item')

  return (
    <li
      className={cn(
        'marker:text-inherit',
        {
          'ps-0': isTaskItem
        },
        className
      )}
      {...props}
    />
  )
}
