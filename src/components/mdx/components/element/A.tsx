import { OpenInNew, Tag } from '@mui/icons-material'
import Link from 'next/link'
import React from 'react'

export default function A({ children, ...props }: React.ComponentProps<'a'>) {
  if (!props.href) return null

  // 外部链接
  if (['http', '//'].some(str => props.href?.startsWith(str))) {
    return (
      <a {...props} rel="noreferrer nofollow" target="_blank">
        {children}
        <OpenInNew className="ml-0.5 align-middle text-[length:80%]" />
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
      <Tag className="align-middle text-[length:initial]" />
      {children}
    </Link>
  )
}
