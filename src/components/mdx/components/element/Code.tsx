'use client'

import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

export default function Code({ children, ...props }: React.ComponentProps<'code'>) {
  const [_, copy] = useCopyToClipboard()

  // pre > code
  if (Reflect.has(props, 'data-theme')) {
    return <code {...props}>{children}</code>
  }

  return (
    <code
      className="cursor-pointer select-none rounded bg-slate-200/70 px-1.5 py-1 font-medium before:content-none after:content-none dark:bg-slate-600/70"
      onDoubleClick={event => {
        const code = (event.target as HTMLElement).textContent
        if (!code) return
        copy(code)
        toast.success('复制成功')
      }}
    >
      {children}
    </code>
  )
}
