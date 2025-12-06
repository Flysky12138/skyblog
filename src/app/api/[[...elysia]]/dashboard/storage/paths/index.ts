import { Elysia } from 'elysia'

import { idModel } from '../../../model'
import { Service } from './service'

export const paths = new Elysia({ prefix: '/paths' }).use(idModel).get('/:id', ({ params }) => Service.detail(params.id), {
  params: 'uuidv7'
})
