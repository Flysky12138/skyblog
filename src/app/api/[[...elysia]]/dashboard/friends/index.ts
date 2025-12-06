import { Elysia } from 'elysia'

import { idModel } from '../../model'
import { FriendCreateBodySchema, FriendUpdateBodySchema } from './model'
import { Service } from './service'

export const friends = new Elysia({ prefix: '/friends' })
  .use(idModel)
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: FriendCreateBodySchema
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: FriendUpdateBodySchema,
    params: 'uuidv7'
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
