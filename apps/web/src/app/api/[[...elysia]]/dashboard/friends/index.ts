import { Elysia } from 'elysia'
import z from 'zod'

import { FriendCoverBodySchema, FriendCreateBodySchema, FriendUpdateBodySchema } from './model'
import { Service } from './service'

export const friends = new Elysia({ prefix: '/friends' })
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: FriendCreateBodySchema
  })
  .post('/cover', ({ body }) => Service.generateCover(body), {
    body: FriendCoverBodySchema
  })
  .guard({
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: FriendUpdateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id))
