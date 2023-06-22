'use client'

import { SESSIONSTORAGE } from '@/lib/keys'
import { CustomFetch } from '@/lib/server/fetch'
import { useAsync } from 'react-use'

const postAnalytic = async () => {
  return await CustomFetch('/api/visitor', {
    method: 'POST'
  })
}

export default function Analytic() {
  useAsync(async () => {
    if (window.sessionStorage.getItem(SESSIONSTORAGE.ANALYTIC_SUBMITTED) == '1') return
    await postAnalytic()
    window.sessionStorage.setItem(SESSIONSTORAGE.ANALYTIC_SUBMITTED, '1')
  })

  return null
}
