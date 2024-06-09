'use client'

import { SESSIONSTORAGE } from '@/lib/constants'
import { CustomFetch } from '@/lib/server/fetch'
import { useSession } from 'next-auth/react'
import { useAsync, useSessionStorage } from 'react-use'

const postAnalytic = async () => {
  return await CustomFetch('/api/visitor', {
    method: 'POST'
  })
}

export default function Analytic() {
  const session = useSession()
  const [submitted, setSubmitted] = useSessionStorage(SESSIONSTORAGE.ANALYTIC_SUBMITTED, false)

  useAsync(async () => {
    if (session.data?.role == 'ADMIN') return
    if (submitted) return
    await postAnalytic()
    setSubmitted(true)
  })

  return null
}
