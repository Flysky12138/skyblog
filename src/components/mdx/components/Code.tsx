import React from 'react'

export default function Code({ children, className, ...props }: React.ComponentProps<'code'>) {
  // pre > code
  if (className?.includes('language-')) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <code className="rounded border border-gray-300 bg-slate-100 px-1.5 py-0.5 before:content-none after:content-none dark:border-slate-600/60 dark:bg-slate-600/40">
      {children}
    </code>
  )
}
