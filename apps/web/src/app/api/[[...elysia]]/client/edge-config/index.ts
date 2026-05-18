import { get } from '@vercel/edge-config'
import { Elysia } from 'elysia'

import { EdgeConfigDetailResponseSchema, EdgeConfigQuerySchema } from './model'

export const edgeConfig = new Elysia({ prefix: '/edge-config' }).get(
  '/get',
  async ({ query }) => ({
    key: query.key,
    value: await get(query.key)
  }),
  {
    query: EdgeConfigQuerySchema,
    response: {
      200: EdgeConfigDetailResponseSchema
    }
  }
)
