import { Elysia } from 'elysia'

import { visit } from './visit'

export const analytics = new Elysia({ prefix: '/analytics' }).use(visit)
