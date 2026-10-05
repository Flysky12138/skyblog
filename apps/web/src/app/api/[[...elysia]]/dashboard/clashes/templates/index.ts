import { Elysia } from 'elysia'
import z from 'zod'

import { ClashTemplateCreateBodySchema, ClashTemplateUpdateBodySchema } from './model'
import { Service } from './service'

export const templates = new Elysia({ prefix: '/templates' })
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: ClashTemplateCreateBodySchema
  })
  .guard({
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: ClashTemplateUpdateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id))
