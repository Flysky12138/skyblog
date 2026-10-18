import { Elysia } from 'elysia'

import { adminOnly } from '../plugins'
import { clashes } from './clashes'
import { edgeConfig } from './edge-config'
import { friends } from './friends'
import { posts } from './posts'
import { storage } from './storage'
import { users } from './users'

export const dashboard = new Elysia({ prefix: '/dashboard' })
  .use(adminOnly)
  .use(clashes)
  .use(edgeConfig)
  .use(friends)
  .use(posts)
  .use(storage)
  .use(users)
