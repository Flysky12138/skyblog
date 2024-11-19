'use client'

import { cn } from '@/lib/cn'
import { ExpandMoreRounded } from '@mui/icons-material'
import React, { useRef } from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

export default function Code({ children, className, ...props }: React.ComponentProps<'code'>) {
  const [_, copy] = useCopyToClipboard()

  // pre > code
  const codeRef = useRef<HTMLElement>(null)
  if (Reflect.has(props, 'data-theme') && Reflect.has(props, 'style')) {
    const lineNumber = (React.Children.count(children) + 1) / 2
    const overflow = lineNumber >= 18

    return (
      <code
        ref={codeRef}
        className={cn(
          'group data-[expanded=false]:h-[calc(18*1.25rem)] data-[expanded=false]:overflow-hidden',
          {
            'data-[expanded=true]:pb-8': overflow
          },
          className
        )}
        data-expanded={!overflow}
        {...props}
      >
        {children}
        {overflow && (
          <div
            className={cn([
              'absolute bottom-0 flex h-8 w-full items-center justify-center',
              'bg-gradient-to-b from-transparent to-white to-50% dark:to-[#25252C]'
            ])}
          >
            <div
              aria-label="Expanded toggle button"
              className="flex h-full w-8 items-center justify-center overflow-hidden"
              role="button"
              onClick={() => {
                const target = codeRef.current
                if (!target) return
                const expanded = target.dataset['expanded']
                target.dataset['expanded'] = expanded == 'true' ? 'false' : 'true'
              }}
            >
              <ExpandMoreRounded className="group-data-[expanded=true]:rotate-180" color="primary" fontSize="medium" />
            </div>
          </div>
        )}
      </code>
    )
  }

  // code
  return (
    <code
      className={cn(
        [
          'cursor-copy select-none rounded bg-slate-200/50 px-1.5 py-1 dark:bg-slate-600/50',
          'before:content-none after:content-none',
          'border border-transparent transition-colors hover:border-sky-200 hover:dark:border-sky-700'
        ],
        className
      )}
      onClick={event => {
        const target = event.target as HTMLElement
        const code = target.textContent
        if (!code) return
        copy(code)
        toast.success('复制成功')
      }}
      {...props}
    >
      {children}
    </code>
  )
}
