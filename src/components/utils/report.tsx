'use client'

import { useSession } from 'next-auth/react'
import { useAsync } from 'react-use'

import { CustomRequest } from '@/lib/http/request'

export const Report = () => {
  const session = useSession()

  useAsync(async () => {
    if (session.status == 'loading' || session.data?.role == 'ADMIN') return
    await CustomRequest('POST /api/visitor', {})
  }, [session])

  return null
}
