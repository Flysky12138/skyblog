'use client'

import { SESSIONSTORAGE } from '@/lib/constants'
import { CustomRequest } from '@/lib/server/request'
import { useSession } from 'next-auth/react'
import { useAsync, useSessionStorage } from 'react-use'

export default function Analytic() {
  const session = useSession()
  const [submitted, setSubmitted] = useSessionStorage(SESSIONSTORAGE.ANALYTIC_SUBMITTED, false)

  useAsync(async () => {
    if (session.status != 'authenticated') return
    if (session.data?.role == 'ADMIN') return
    if (submitted) return
    await CustomRequest('POST api/visitor', {})
    setSubmitted(true)
  }, [session])

  return null
}
