import { Elysia } from 'elysia'

import { clashes } from './clashes'
import { crons } from './crons'
import { edgeConfig } from './edge-config'
import { friends } from './friends'
import { posts } from './posts'
import { storage } from './storage'
import { users } from './users'

export const dashboard = new Elysia({ prefix: '/dashboard' }).use(clashes).use(crons).use(edgeConfig).use(friends).use(posts).use(storage).use(users)
