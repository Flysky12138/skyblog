'use client'

import { useAsync } from 'react-use'

import { authClient } from '@/lib/auth/client'
import { rpc } from '@/lib/rpc'

export function Report() {
  const { data: session, isPending } = authClient.useSession()

  useAsync(async () => {
    if (!isPending) return
    if (session?.user.role == 'admin') return
    await rpc.visits.post()
  }, [isPending, session])

  return null
}
