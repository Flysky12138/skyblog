import { Elysia } from 'elysia'
import z from 'zod'

import { paginationModel } from '../../model'
import { authRequired } from '../../plugins'
import { categories } from './categories'
import { PostCreateBodySchema, PostUpdateBodySchema } from './model'
import { Service } from './service'
import { tags } from './tags'

export const posts = new Elysia({ prefix: '/posts' })
  .use(authRequired)
  .use(paginationModel)
  .use(categories)
  .use(tags)
  .get('/', ({ query }) => Service.list(query), {
    query: 'pagination.query'
  })
  .post('/', ({ body, user }) => Service.create(body, user.id), {
    body: PostCreateBodySchema
  })
  .guard({
    params: z.strictObject({
      id: z.uuidv7()
    })
  })
  .get('/:id', ({ params }) => Service.detail(params.id))
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: PostUpdateBodySchema
  })
  .delete('/:id', ({ params }) => Service.delete(params.id))
