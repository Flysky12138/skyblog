'use client'

import React from 'react'

import { DATA_IS_BLOCK, DATA_IS_COLLAPSED } from '@/components/mdx/rehype/rehype-code'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export const Code = (props: React.ComponentProps<'code'>) => {
  const Comp = Reflect.has(props, DATA_IS_BLOCK) ? CodeBlock : CodeInline
  return <Comp {...props} />
}

const CodeBlock = ({
  className,
  [DATA_IS_COLLAPSED]: isCollapsed = false,
  ...props
}: React.ComponentProps<'code'> & {
  [DATA_IS_COLLAPSED]?: boolean
}) => (
  <ScrollArea
    className={cn({
      '*:data-[slot=scroll-area-viewport]:max-h-100': isCollapsed
    })}
  >
    <code className={cn('text-[1em] font-semibold', className)} {...props} />
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
)

const CodeInline = ({ className, ...props }: React.ComponentProps<'code'>) => (
  <code
    className={cn('bg-muted rounded-sm border px-1.5 py-1 font-semibold break-all', 'before:content-none after:content-none', className)}
    {...props}
  />
)
