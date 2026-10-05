import { Elysia } from 'elysia'
import z from 'zod'

import { Service } from './service'

export const directories = new Elysia({ prefix: '/directories' })
  .guard({
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
  .get('/:id', ({ params }) => Service.list(params.id))
  .delete('/:id', ({ params }) => Service.delete(params.id))
