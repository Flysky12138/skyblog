'use client'

import { useSession } from 'next-auth/react'
import React from 'react'
import { Auth } from '../../../types/auth'

interface DisplayMatchEnvAuthProps {
  children: React.ReactNode
  /**
   * 反向匹配
   * @default false
   */
  reverse?: boolean
  role: Auth['role']
}

export default function DisplayMatchAuth({ children, role, reverse = false }: DisplayMatchEnvAuthProps) {
  const session = useSession()
  if ((session.data?.role == role) == !reverse) return children
  return null
}
