'use client'

import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { ArrowDownToDotIcon, ArrowUpFromDotIcon } from 'lucide-react'
import React from 'react'

import { DATA_IS_BLOCK } from '../../../plugins/rehype/rehype-code'

const MAX_LINES = 30

interface CodeProps extends React.ComponentProps<'code'> {
  /**
   * @default true
   */
  forceExpand?: boolean
}

export function Code(props: CodeProps) {
  const Comp = Reflect.has(props, DATA_IS_BLOCK) ? CodeBlock : CodeInline
  return <Comp {...props} />
}

/**
 * 代码块
 */
function CodeBlock({ children, className, forceExpand = true, style, ...props }: CodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const btnRef = React.useRef<HTMLButtonElement>(null)

  let lineCount = 0
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    lineCount++
  })

  const handleToggle = React.useCallback(() => {
    const beforeTop = btnRef.current!.getBoundingClientRect().top

    setIsExpanded(v => !v)

    if (isExpanded) {
      requestAnimationFrame(() => {
        const afterTop = btnRef.current!.getBoundingClientRect().top
        window.scrollBy({
          behavior: 'auto',
          top: afterTop - beforeTop
        })
      })
    }
  }, [isExpanded])

  return (
    <>
      <code
        className={cn(
          'relative no-scrollbar overflow-x-auto py-2.5 text-sm font-semibold',
          {
            'max-h-(--max-h) overflow-y-hidden': !isExpanded && !forceExpand
          },
          className
        )}
        data-lines={lineCount}
        style={
          {
            '--max-h': `calc(var(--spacing)*${5 * MAX_LINES})`,
            ...style
          } as React.CSSProperties
        }
        tabIndex={-1}
        {...props}
      >
        {children}
      </code>
      {!forceExpand && lineCount >= MAX_LINES && (
        <div
          className={cn(
            'sticky bottom-0 flex cursor-pointer justify-center py-1 text-foreground',
            'border-t border-dashed bg-sheet/80 backdrop-blur-[2px]'
          )}
          onClick={handleToggle}
        >
          <Button ref={btnRef} size="icon-xs" variant="ghost">
            {isExpanded ? <ArrowUpFromDotIcon strokeWidth={3} /> : <ArrowDownToDotIcon strokeWidth={3} />}
          </Button>
        </div>
      )}
    </>
  )
}

/**
 * 行内代码
 */
function CodeInline({ className, forceExpand, ...props }: CodeProps) {
  return (
    <code
      className={cn('rounded-sm border bg-muted px-1.5 py-0.5 font-semibold break-all', 'before:content-none after:content-none', className)}
      {...props}
    />
  )
}
