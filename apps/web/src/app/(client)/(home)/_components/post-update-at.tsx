'use client'

import { CalendarDaysIcon } from 'lucide-react'
import React from 'react'
import { browser } from 'react-dom'

import { TimeHelper } from '@/lib/helper/time'

interface PostUpdateAtProps {
  updatedAt: Date
}

export function PostUpdateAt({ updatedAt }: PostUpdateAtProps) {
  React.use(browser())

  return (
    <>
      <CalendarDaysIcon size={12} />
      更新于 {TimeHelper.fromNow(updatedAt)}
    </>
  )
}
