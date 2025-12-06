import { Elysia } from 'elysia'

import { uuidModel } from '../../model'
import { Service } from './service'

export const posts = new Elysia({ prefix: '/posts' })
  .use(uuidModel)
  .get('/:id', ({ params }) => Service.detail(params.id), {
    params: 'uuidv7'
  })
  .patch('/:id', ({ params }) => Service.update(params.id), {
    params: 'uuidv7'
  })
