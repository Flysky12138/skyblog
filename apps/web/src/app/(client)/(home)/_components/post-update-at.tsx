'use client'

import { CalendarDaysIcon } from 'lucide-react'

import { TimeHelper } from '@/lib/helper/time'

interface PostUpdateAtProps {
  updatedAt: Date
}

export function PostUpdateAt({ updatedAt }: PostUpdateAtProps) {
  return (
    <>
      <CalendarDaysIcon size={12} />
      更新于 {TimeHelper.fromNow(updatedAt)}
    </>
  )
}
