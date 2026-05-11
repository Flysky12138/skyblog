import { cn } from '@repo/ui/lib/utils'
import { ArrowUpRightIcon, HashIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export function A({ children, className, ...props }: React.ComponentProps<'a'>) {
  if (!props.href) return null

  className = cn('no-underline decoration-wavy underline-offset-2 hover:underline', 'focus-visible:ring-3', className)

  // 外部链接
  if (['http', '//'].some(it => props.href?.startsWith(it))) {
    return (
      <a className={className} rel="noreferrer nofollow" target="_blank" {...props}>
        {children}
        <ArrowUpRightIcon className="inline-block translate-y-1 align-super" size={12} />
      </a>
    )
  }

  // 内部链接
  return (
    <Link className={className} href={props.href}>
      <HashIcon className="ml-1 inline-block -translate-y-0.5" size={12} />
      {children}
    </Link>
  )
}
