import { Elysia } from 'elysia'

import { idModel } from '../../../model'
import { Service } from './service'

export const tiptap = new Elysia({ prefix: '/tiptap' }).use(idModel).get('/:id', ({ params }) => Service.detail(params.id), {
  params: 'uuidv7'
})
