'use client'

import React from 'react'
import { ScrollArea, ScrollBar } from 'ui/scroll-area'

import { DATA_EXPAND, DATA_IS_BLOCK } from '@/components/mdx/rehype/rehype-code'
import { cn } from '@/lib/utils'

export const Code = (props: React.ComponentProps<'code'>) => {
  const Comp = Reflect.has(props, DATA_IS_BLOCK) ? (Reflect.has(props, DATA_EXPAND) ? CodeBlock : CodeBlockScrollArea) : CodeInline
  return <Comp {...props} />
}

const CodeBlock = ({ className, ...props }: React.ComponentProps<'code'>) => <code className={cn('text-[1em] font-semibold', className)} {...props} />

const CodeBlockScrollArea = (props: React.ComponentProps<typeof CodeBlock>) => (
  <ScrollArea className="*:data-[slot='scroll-area-viewport']:max-h-[400px]">
    <CodeBlock {...props} />
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
)

const CodeInline = ({ className, ...props }: React.ComponentProps<'code'>) => (
  <code className={cn('bg-sheet rounded-sm px-1.5 py-1 font-semibold break-all before:content-none after:content-none', className)} {...props} />
)
