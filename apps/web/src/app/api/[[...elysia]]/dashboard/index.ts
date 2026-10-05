import { Elysia } from 'elysia'

import { authServer } from '@/lib/auth/server'

import { clashes } from './clashes'
import { edgeConfig } from './edge-config'
import { friends } from './friends'
import { posts } from './posts'
import { storage } from './storage'
import { users } from './users'

const auth = new Elysia({ name: 'auth' }).derive({ as: 'scoped' }, async ({ headers, status }) => {
  const session = await authServer.getSession({
    fetchOptions: {
      headers
    }
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

const admin = new Elysia({ name: 'admin' })
  .use(auth)
  .onBeforeHandle(({ status, user }) => {
    if (user.role !== 'admin') {
      return status(401)
    }
  })
  .as('scoped')

export const dashboard = new Elysia({ prefix: '/dashboard' }).use(admin).use(clashes).use(edgeConfig).use(friends).use(posts).use(storage).use(users)
