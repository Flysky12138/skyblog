import { Elysia } from 'elysia'

import { idModel } from '../../../model'
import { StorageFileCreateBodySchema } from './model'
import { Service } from './service'

export const files = new Elysia({ prefix: '/files' })
  .use(idModel)
  .post('/', ({ body }) => Service.create(body), {
    body: StorageFileCreateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
