import { cn } from '@repo/ui/lib/utils'
import React from 'react'

import { DATA_IS_BLOCK, DATA_IS_COLLAPSED } from '../../../plugins/rehype/rehype-code'

export function Code(props: React.ComponentProps<'code'>) {
  const Comp = Reflect.has(props, DATA_IS_BLOCK) ? CodeBlock : CodeInline
  return <Comp {...props} />
}

function CodeBlock({
  className,
  [DATA_IS_COLLAPSED]: isCollapsed = false,
  ...props
}: React.ComponentProps<'code'> & {
  [DATA_IS_COLLAPSED]?: boolean
}) {
  return (
    <code
      className={cn(
        'relative no-scrollbar overflow-x-auto py-2.5 text-[1em] font-semibold',
        {
          'max-h-100': isCollapsed
        },
        className
      )}
      tabIndex={-1}
      {...props}
    />
  )
}

function CodeInline({ className, ...props }: React.ComponentProps<'code'>) {
  return (
    <code
      className={cn('rounded-sm border bg-muted px-1.5 py-0.5 font-semibold break-all', 'before:content-none after:content-none', className)}
      {...props}
    />
  )
}
