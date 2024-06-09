'use client'

import { Avatar } from '@mui/joy'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Admin() {
  const session = useSession()

  if (session.status == 'loading') return null
  if (!session.data?.user) return null

  return (
    <Link className="flex items-center gap-x-2 rounded-lg p-1 hover:bg-slate-200 dark:hover:bg-slate-700" href="/auth/signout">
      <Avatar size="md">
        <Image priority alt={session.data.user.name || ''} height={200} src={session.data.user.image?.replace('https://', '/cdn/') || ''} width={200} />
      </Avatar>
      <div className="flex flex-col gap-y-1 break-all">
        <p className="text-sm">{session.data.user.name}</p>
        <p className="s-subtitle text-xs">{session.data.user.email}</p>
      </div>
    </Link>
  )
}
