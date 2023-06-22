'use client'

import { cn } from '@/lib/cn'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

export default function Code({ children, ...props }: React.ComponentProps<'code'>) {
  const [_, copy] = useCopyToClipboard()

  // pre > code
  if (Reflect.has(props, 'data-theme') && Reflect.has(props, 'style')) {
    return <code {...props}>{children}</code>
  }

  // code
  return (
    <code
      className={cn([
        'cursor-pointer select-all rounded bg-slate-200/50 px-1.5 py-1 dark:bg-slate-600/50',
        'before:content-none after:content-none',
        'border border-transparent transition-colors hover:border-sky-200 hover:dark:border-sky-700'
      ])}
      onDoubleClick={event => {
        const code = (event.target as HTMLElement).textContent
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
