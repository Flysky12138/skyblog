'use client'

import { useSession } from 'next-auth/react'

import { Auth } from '@/../types/auth'

import { DisplayByConditional, DisplayByConditionalProps } from './display-by-conditional'

interface DisplayByAuthProps extends Omit<DisplayByConditionalProps, 'condition'> {
  role: Auth['role']
}

export const DisplayByAuth = ({ role, ...props }: DisplayByAuthProps) => {
  const session = useSession()

  return <DisplayByConditional condition={session.data?.role == role} {...props} />
}
