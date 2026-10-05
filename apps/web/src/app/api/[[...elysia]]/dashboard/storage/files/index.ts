import { Elysia } from 'elysia'
import z from 'zod'

import { StorageFileCreateBodySchema } from './model'
import { Service } from './service'

export const files = new Elysia({ prefix: '/files' })
  .post('/', ({ body }) => Service.create(body), {
    body: StorageFileCreateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
