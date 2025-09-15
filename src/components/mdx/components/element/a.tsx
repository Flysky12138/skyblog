import { ArrowUpRight, Hash } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

export const A = ({ children, className, ...props }: React.ComponentProps<'a'>) => {
  if (!props.href) return null

  className = cn('no-underline underline-offset-2 hover:underline', className)

  // 外部链接
  if (['http', '//'].some(it => props.href?.startsWith(it))) {
    return (
      <a className={className} rel="noreferrer nofollow" target="_blank" {...props}>
        {children}
        <ArrowUpRight className="inline-block translate-y-1 align-super" size={12} />
      </a>
    )
  }

  // 内部链接
  return (
    <Link className={className} href={props.href as Route}>
      <Hash className="ml-1 inline-block -translate-y-0.5" size={12} />
      {children}
    </Link>
  )
}
