import { Elysia } from 'elysia'
import z from 'zod'

import { Service } from './service'

export const paths = new Elysia({ prefix: '/paths' }).get('/:id', ({ params }) => Service.detail(params.id), {
  params: z.strictObject({
    id: z.uuidv7()
  })
})
