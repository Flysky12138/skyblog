import { Elysia } from 'elysia'
import z from 'zod'

import { ClashCreateBodySchema, ClashUpdateBodySchema } from './model'
import { Service } from './service'
import { templates } from './templates'

export const clashes = new Elysia({ prefix: '/clashes' })
  .use(templates)
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: ClashCreateBodySchema
  })
  .guard({
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: ClashUpdateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id))
