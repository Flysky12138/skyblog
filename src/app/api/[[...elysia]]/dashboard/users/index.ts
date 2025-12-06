import { Elysia } from 'elysia'

import { members } from './members'
import { visits } from './visits'

export const users = new Elysia({ prefix: '/users' }).use(members).use(visits)
