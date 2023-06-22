'use client'

import { fromNow } from '@/lib/parser/time'

interface PostUpdateAtProps {
  value: Date
}

export default function PostUpdateAt({ value }: PostUpdateAtProps) {
  return <>更新于 {fromNow(value)}</>
}
