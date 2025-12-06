'use server'

import { createAuthServer } from '@neondatabase/auth/next/server'

export const authServer = async () => createAuthServer()

/**
 * 验证权限
 */
export const checkRole = async (role: 'admin' | 'user') => {
  const auth = await authServer()
  const session = await auth.getSession()

  return session.data?.user.role == role
}

/**
 * 是否是管理员
 */
export const assertAdminRole = async () => {
  if (!(await checkRole('admin'))) {
    throw new Error('Unauthorized')
  }
}
