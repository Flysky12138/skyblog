import { Elysia } from 'elysia'

import { uuidModel } from '../../../model'
import { StorageFileCreateBodySchema } from './model'
import { Service } from './service'

export const files = new Elysia({ prefix: '/files' })
  .use(uuidModel)
  .post('/', ({ body }) => Service.create(body), {
    body: StorageFileCreateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
