'use client'

import { CalendarDaysIcon } from 'lucide-react'
import { io } from 'next/cache'
import React from 'react'

import { TimeHelper } from '@/lib/helper/time'

interface PostUpdateAtProps {
  updatedAt: Date
}

export function PostUpdateAt({ updatedAt }: PostUpdateAtProps) {
  React.use(io())

  return (
    <>
      <CalendarDaysIcon size={12} />
      更新于 {TimeHelper.fromNow(updatedAt)}
    </>
  )
}
