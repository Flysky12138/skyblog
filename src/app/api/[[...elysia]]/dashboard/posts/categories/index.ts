import { Elysia } from 'elysia'

import { idModel } from '../../../model'
import { CategoryCreateBodySchema, CategoryUpdateBodySchema } from './model'
import { Service } from './service'

export const categories = new Elysia({ prefix: '/categories' })
  .use(idModel)
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: CategoryCreateBodySchema
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: CategoryUpdateBodySchema,
    params: 'uuidv7'
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
