import { Elysia } from 'elysia'
import z from 'zod'

import { TagCreateBodySchema, TagUpdateBodySchema } from './model'
import { Service } from './service'

export const tags = new Elysia({ prefix: '/tags' })
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: TagCreateBodySchema
  })
  .guard({
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: TagUpdateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id))
