'use client'

import { authClient } from '@/lib/auth/client'

import { Show, ShowProps } from '.'

interface ShowByAuthProps extends Omit<ShowProps, 'when'> {
  role: 'admin' | 'user'
}

export function ShowByAuth({ role, ...props }: ShowByAuthProps) {
  const { data, isPending } = authClient.useSession()

  if (isPending) return null

  return <Show when={data?.user.role === role} {...props} />
}
