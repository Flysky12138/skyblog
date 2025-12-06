import { Elysia } from 'elysia'

import { uuidModel } from '../../../model'
import { ClashTemplateCreateBodySchema, ClashTemplateUpdateBodySchema } from './model'
import { Service } from './service'

export const templates = new Elysia({ prefix: '/templates' })
  .use(uuidModel)
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: ClashTemplateCreateBodySchema
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: ClashTemplateUpdateBodySchema,
    params: 'uuidv7'
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
