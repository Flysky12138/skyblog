import { Elysia } from 'elysia'

import { clashes } from './clashes'
import { friends } from './friends'
import { posts } from './posts'
import { storage } from './storage'
import { users } from './users'

export const dashboard = new Elysia({ prefix: '/dashboard' }).use(clashes).use(friends).use(posts).use(storage).use(users)
