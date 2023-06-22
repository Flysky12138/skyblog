'use client'

import { Button } from '@mui/joy'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function LinkTo() {
  const session = useSession()
  const to = useSearchParams().get('to')

  if (!to) return null

  if (session.data?.role == 'USER') {
    if (to.startsWith('/dashboard')) return null
  }

  return (
    <Button color="neutral" component={Link} href={to} variant="outlined">
      回到目标页
    </Button>
  )
}
