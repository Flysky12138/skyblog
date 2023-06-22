'use client'

import { fromNow } from '@/lib/parser/time'

interface UpdateAtProps {
  value: Date
}

export default function UpdateAt({ value }: UpdateAtProps) {
  return <>更新于 {fromNow(value)}</>
}
