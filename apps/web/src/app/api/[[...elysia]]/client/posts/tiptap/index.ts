import { Elysia } from 'elysia'
import z from 'zod'

import { Service } from './service'

export const tiptap = new Elysia({ prefix: '/tiptap' }).get('/:id', ({ params }) => Service.detail(params.id), {
  params: z.strictObject({
    id: z.uuidv7()
  })
})
