import { Elysia } from 'elysia'

import { uuidModel } from '../../../model'
import { Service } from './service'

export const paths = new Elysia({ prefix: '/paths' }).use(uuidModel).get('/:id', ({ params }) => Service.detail(params.id), {
  params: 'uuidv7'
})
