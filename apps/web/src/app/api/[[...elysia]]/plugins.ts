import { Elysia } from 'elysia'

import { authServer } from '@/lib/auth/server'

/**
 * 必须登录
 */
export const authRequired = new Elysia({ name: 'auth-required' }).derive({ as: 'scoped' }, async ({ headers, status }) => {
  const session = await authServer.getSession({
    fetchOptions: { headers }
  })

  if (!session?.data?.user) {
    return status(401)
  }

  if (session.data.user.banned) {
    return status(403, session.data.user.banReason)
  }

  return {
    session: session.data.session,
    user: session.data.user
  }
})

/**
 * 可选登录
 */
export const authOptional = new Elysia({ name: 'auth-optional' }).derive({ as: 'scoped' }, async ({ headers }) => {
  const session = await authServer.getSession({
    fetchOptions: { headers }
  })

  return {
    session: session?.data?.session ?? null,
    user: session?.data?.user ?? null
  }
})

/**
 * 仅管理员
 */
export const adminOnly = new Elysia({ name: 'admin-only' })
  .use(authRequired)
  .onBeforeHandle(({ status, user }) => {
    if (user.role !== 'admin') {
      return status(403)
    }
  })
  .as('scoped')
