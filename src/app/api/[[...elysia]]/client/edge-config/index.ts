import { get, has } from '@vercel/edge-config'
import { Elysia } from 'elysia'

import { EdgeConfigQuerySchema } from './model'

export const edgeConfig = new Elysia({ prefix: '/edge-config' })
  .get('/get', ({ query }) => get(query.key), {
    query: EdgeConfigQuerySchema
  })
  .get('/has', ({ query }) => has(query.key), {
    query: EdgeConfigQuerySchema
  })
