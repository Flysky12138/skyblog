import { Elysia } from 'elysia'

import { idModel } from '../../model'
import { ClashCreateBodySchema, ClashUpdateBodySchema } from './model'
import { Service } from './service'
import { templates } from './templates'

export const clashes = new Elysia({ prefix: '/clashes' })
  .use(idModel)
  .use(templates)
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: ClashCreateBodySchema
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: ClashUpdateBodySchema,
    params: 'uuidv7'
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
