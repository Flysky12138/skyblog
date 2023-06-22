'use client'

import { SESSIONSTORAGE } from '@/lib/constants'
import { CustomFetch } from '@/lib/server/fetch'
import { useSession } from 'next-auth/react'
import { useAsync } from 'react-use'

const postAnalytic = async () => {
  return await CustomFetch('/api/visitor', {
    method: 'POST'
  })
}

export default function Analytic() {
  const session = useSession()

  useAsync(async () => {
    if (session.data?.role == 'ADMIN') return
    if (window.sessionStorage.getItem(SESSIONSTORAGE.ANALYTIC_SUBMITTED) == '1') return
    await postAnalytic()
    window.sessionStorage.setItem(SESSIONSTORAGE.ANALYTIC_SUBMITTED, '1')
  })

  return null
}
