import { Elysia } from 'elysia'

import { uuidModel } from '../../../model'
import { Service } from './service'

export const directories = new Elysia({ prefix: '/directories' }).use(uuidModel).get('/:id', ({ params }) => Service.list(params.id), {
  params: 'uuidv7'
})
