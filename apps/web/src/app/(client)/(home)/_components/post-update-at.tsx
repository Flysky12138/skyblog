import { CalendarDaysIcon } from 'lucide-react'
import { connection } from 'next/server'

import { TimeHelper } from '@/lib/helper/time'

interface PostUpdateAtProps {
  updatedAt: Date
}

export async function PostUpdateAt({ updatedAt }: PostUpdateAtProps) {
  await connection()

  return (
    <>
      <CalendarDaysIcon size={12} />
      更新于 {TimeHelper.fromNow(updatedAt)}
    </>
  )
}
