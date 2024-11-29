'use client'

import { DATA_BLOCK, DATA_EXPAND_LINE } from '@/components/mdx/rehype/rehype-code'
import { cn } from '@/lib/cn'
import { ExpandMoreRounded } from '@mui/icons-material'
import { Box } from '@mui/joy'
import React from 'react'

export default function Code({ children, className, ...props }: React.ComponentProps<'code'>) {
  // pre > code
  const codeRef = React.useRef<HTMLElement>(null)
  if (Reflect.get(props, DATA_BLOCK) == 'true') {
    const codeLine = (React.Children.count(children) + 1) / 2
    const expandLine = Number.parseInt(Reflect.get(props, DATA_EXPAND_LINE))
    const overflow = codeLine > (expandLine || Infinity)

    return (
      <Box
        // @ts-ignore
        ref={codeRef}
        className={cn(
          'group data-[expanded=false]:h-[--unexpanded-h] data-[expanded=false]:overflow-hidden',
          {
            'data-[expanded=true]:pb-8': overflow
          },
          className
        )}
        component="code"
        data-expanded={!overflow}
        sx={{
          '--unexpanded-h': `${expandLine * 1.25}rem`
        }}
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
      </Box>
    )
  }

  // code
  return (
    <code className={cn(['rounded bg-slate-200/50 px-1.5 py-1 dark:bg-slate-600/50', 'before:content-none after:content-none'], className)} {...props}>
      {children}
    </code>
  )
}
