import { Elysia } from 'elysia'

import { idModel } from '../../model'
import { Service } from './service'

export const posts = new Elysia({ prefix: '/posts' })
  .use(idModel)
  .get('/:id', ({ params }) => Service.detail(params.id), {
    params: 'uuidv7'
  })
  .patch('/:id', ({ params }) => Service.update(params.id), {
    params: 'uuidv7'
  })
