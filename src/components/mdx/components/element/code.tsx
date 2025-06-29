'use client'

import React from 'react'
import { ScrollArea, ScrollBar } from 'ui/scroll-area'

import { DATA_EXPANDED, DATA_IS_BLOCK } from '@/components/mdx/rehype/rehype-code'
import { cn } from '@/lib/utils'

export const Code = (props: React.ComponentProps<'code'>) => {
  const Comp = Reflect.has(props, DATA_IS_BLOCK) ? CodeBlock : CodeInline
  return <Comp {...props} />
}

const CodeBlock = ({
  className,
  [DATA_EXPANDED]: isExpanded,
  ...props
}: React.ComponentProps<'code'> & {
  [DATA_EXPANDED]?: boolean
}) => (
  <ScrollArea
    className={cn({
      "*:data-[slot='scroll-area-viewport']:max-h-100": !isExpanded
    })}
  >
    <code className={cn('text-[1em] font-semibold', className)} {...props} />
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
)

const CodeInline = ({ className, ...props }: React.ComponentProps<'code'>) => (
  <code
    className={cn(
      ['text-code-foreground bg-code', 'rounded-sm px-1.5 py-1 font-semibold break-all', 'before:content-none after:content-none'],
      className
    )}
    {...props}
  />
)
