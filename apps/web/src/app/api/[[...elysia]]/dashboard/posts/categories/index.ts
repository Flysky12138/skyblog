import { Elysia } from 'elysia'
import z from 'zod'

import { CategoryCreateBodySchema, CategoryUpdateBodySchema } from './model'
import { Service } from './service'

export const categories = new Elysia({ prefix: '/categories' })
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: CategoryCreateBodySchema
  })
  .guard({
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: CategoryUpdateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id))
