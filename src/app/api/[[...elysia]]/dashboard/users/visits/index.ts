import { Elysia } from 'elysia'

import { paginationModel } from '../../../model'
import { VisitDeleteBodySchema } from './model'
import { Service } from './service'

export const visits = new Elysia({ prefix: '/visits' })
  .use(paginationModel)
  .get('/', async ({ query }) => Service.list(query), {
    query: 'pagination.query'
  })
  .delete('/', async ({ body }) => Service.delete(body), {
    body: VisitDeleteBodySchema
  })
