import { Elysia } from 'elysia'

import { EdgeConfigBodySchema } from './model'
import { Service } from './service'

export const edgeConfig = new Elysia({ prefix: '/edge-config' }).patch('/action', ({ body }) => Service.action(body), {
  body: EdgeConfigBodySchema
})
