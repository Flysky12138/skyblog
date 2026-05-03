import { ArrowUpRightIcon, HashIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

export function A({ children, className, ...props }: React.ComponentProps<'a'>) {
  if (!props.href) return null

  className = cn('no-underline underline-offset-2 hover:underline', className)

  // 外部链接
  if (['http', '//'].some(it => props.href?.startsWith(it))) {
    return (
      <a className={cn('focus-visible:ring-3', className)} rel="noreferrer nofollow" target="_blank" {...props}>
        {children}
        <ArrowUpRightIcon className="inline-block translate-y-1 align-super" size={12} />
      </a>
    )
  }

  // 内部链接
  return (
    <Link className={cn('focus-visible:ring-3', className)} href={props.href}>
      <HashIcon className="ml-1 inline-block -translate-y-0.5" size={12} />
      {children}
    </Link>
  )
}
