import { Elysia } from 'elysia'
import z from 'zod'

import { Service } from './service'
import { tiptap } from './tiptap'

export const posts = new Elysia({ prefix: '/posts' })
  .use(tiptap)
  .guard({
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
  .get('/:id', ({ params }) => Service.detail(params.id))
  .patch('/:id', ({ params }) => Service.update(params.id))
