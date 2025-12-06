'use client'

import { useSession } from 'next-auth/react'

import { Role } from '@/prisma/enums'

import { DisplayByConditional, DisplayByConditionalProps } from './display-by-conditional'

interface DisplayByAuthProps extends Omit<DisplayByConditionalProps, 'condition'> {
  role: Role
}

export const DisplayByAuth = ({ role, ...props }: DisplayByAuthProps) => {
  const session = useSession()

  return <DisplayByConditional condition={session.data?.user?.role == role} {...props} />
}
