import { cn } from '@repo/ui/lib/utils'
import React from 'react'

export function Ul({ className, ...props }: React.ComponentProps<'ul'>) {
  const isTaskList = className?.includes('contains-task-list')

  return (
    <ul
      className={cn(
        'ps-[1em]',
        {
          'list-disc [&_ul]:list-[circle] [&_ul_ul]:list-[square]': !isTaskList,
          'list-none ps-0': isTaskList
        },
        className
      )}
      {...props}
    />
  )
}
