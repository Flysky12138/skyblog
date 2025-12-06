import { Elysia } from 'elysia'

import { idModel } from '../../../model'
import { Service } from './service'

export const directories = new Elysia({ prefix: '/directories' })
  .use(idModel)
  .get('/:id', ({ params }) => Service.list(params.id), {
    params: 'uuidv7'
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
