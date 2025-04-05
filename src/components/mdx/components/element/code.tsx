'use client'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { DATA_EXPAND_LINE, DATA_IS_BLOCK } from '@/components/mdx/rehype/rehype-code'
import { cn } from '@/lib/cn'
import { toMerged } from 'es-toolkit'
import { ChevronDown } from 'lucide-react'
import React from 'react'

export const Code = (props: React.ComponentProps<'code'>) => {
  const Comp = Reflect.has(props, DATA_IS_BLOCK) ? CodeBlock : CodeInline
  return <Comp {...props} />
}

const CodeBlock = ({ children, className, style = {}, ...props }: React.ComponentProps<'code'>) => {
  const codeRef = React.useRef<HTMLElement>(null)

  const codeLine = (React.Children.count(children) + 1) / 2
  const expandLine = Number.parseInt(Reflect.get(props, DATA_EXPAND_LINE))
  const isOver = codeLine > (expandLine || Infinity)

  return (
    <code
      ref={codeRef}
      aria-expanded={!isOver}
      className={cn(
        'group text-[1em] font-semibold aria-[expanded="false"]:h-(--max-h) aria-[expanded="false"]:overflow-hidden',
        {
          'aria-expanded:pb-8!': isOver
        },
        className
      )}
      style={toMerged(style, {
        '--max-h': `${expandLine * 1.25}rem`
      } as React.CSSProperties)}
      {...props}
    >
      {children}
      <DisplayByConditional condition={isOver}>
        <div
          className={cn(
            'absolute bottom-0 flex h-8 w-full items-center justify-center text-[initial]',
            'bg-linear-to-b from-transparent to-white to-50% dark:to-[#25252C]'
          )}
        >
          <div
            aria-label="Expanded toggle button"
            className="flex h-full w-8 items-center justify-center overflow-hidden"
            role="button"
            onClick={() => {
              const target = codeRef.current
              if (!target) return
              const isExpanded = target.getAttribute('aria-expanded') == 'true'
              target.setAttribute('aria-expanded', isExpanded ? 'false' : 'true')
            }}
          >
            <ChevronDown className="group-aria-expanded:rotate-180" size={20} />
          </div>
        </div>
      </DisplayByConditional>
    </code>
  )
}

const CodeInline = ({ className, ...props }: React.ComponentProps<'code'>) => (
  <code className={cn('bg-sheet rounded-sm px-1.5 py-1 font-semibold before:content-none after:content-none', className)} {...props} />
)
