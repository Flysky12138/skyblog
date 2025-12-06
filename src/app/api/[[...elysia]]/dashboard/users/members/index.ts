import { Elysia } from 'elysia'

import { Service } from './service'

export const members = new Elysia({ prefix: '/members' }).get('/', () => Service.list())
