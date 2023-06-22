import { ExternalLink, Hash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const A = ({ children, ...props }: React.ComponentProps<'a'>) => {
  if (!props.href) return null

  props.className = `${props.className} no-underline hover:underline underline-offset-2`

  // 外部链接
  if (['http', '//'].some(it => props.href?.startsWith(it))) {
    return (
      <a {...props} rel="noreferrer nofollow" target="_blank">
        {children}
        <ExternalLink className="ml-1 inline-block" size={14} />
      </a>
    )
  }

  // TOC
  if (props.className?.includes('toc-link')) {
    return (
      // @ts-ignore
      <Link replace {...props}>
        {children}
      </Link>
    )
  }

  // 内部链接
  return (
    <Link href={props.href}>
      <Hash className="ml-1 inline-block" size={14} />
      {children}
    </Link>
  )
}
