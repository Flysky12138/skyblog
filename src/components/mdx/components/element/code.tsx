'use client'

import { DATA_IS_BLOCK } from '@/components/mdx/rehype/rehype-code'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import React from 'react'

export const Code = (props: React.ComponentProps<'code'>) => {
  const Comp = Reflect.has(props, DATA_IS_BLOCK) ? CodeBlock : CodeInline
  return <Comp {...props} />
}

const CodeBlock = ({ className, ...props }: React.ComponentProps<'code'>) => {
  return (
    <ScrollArea className="*:data-[slot='scroll-area-viewport']:max-h-[600px]">
      <code className={cn('text-[1em] font-semibold', className)} {...props} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

const CodeInline = ({ className, ...props }: React.ComponentProps<'code'>) => (
  <code className={cn('bg-sheet rounded-sm px-1.5 py-1 font-semibold break-all before:content-none after:content-none', className)} {...props} />
)
