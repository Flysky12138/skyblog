import { Elysia } from 'elysia'

import { uuidModel } from '../../../model'
import { TagCreateBodySchema, TagUpdateBodySchema } from './model'
import { Service } from './service'

export const tags = new Elysia({ prefix: '/tags' })
  .use(uuidModel)
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: TagCreateBodySchema
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: TagUpdateBodySchema,
    params: 'uuidv7'
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
