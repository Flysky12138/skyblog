'use client'

import { CustomRequest } from '@/lib/http/request'
import { useSession } from 'next-auth/react'
import { useAsync } from 'react-use'

export const Report = () => {
  const session = useSession()

  useAsync(async () => {
    if (session.status == 'loading' || session.data?.role == 'ADMIN') return
    await CustomRequest('POST api/visitor', {})
  }, [session])

  return null
}
