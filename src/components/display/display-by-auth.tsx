'use client'

import { authClient } from '@/lib/auth/client'
import { checkRole } from '@/lib/auth/server'

import { DisplayByConditional, DisplayByConditionalProps } from './display-by-conditional'

interface DisplayByAuthProps extends Omit<DisplayByConditionalProps, 'condition'> {
  role: Parameters<typeof checkRole>[0]
}

export function DisplayByAuth({ role, ...props }: DisplayByAuthProps) {
  const { data, isPending } = authClient.useSession()

  if (isPending) return null

  return <DisplayByConditional condition={data?.user.role == role} {...props} />
}
