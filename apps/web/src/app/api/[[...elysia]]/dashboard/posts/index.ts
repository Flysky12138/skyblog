import { Elysia } from 'elysia'

import { idModel, paginationModel } from '../../model'
import { categories } from './categories'
import { PostCreateBodySchema, PostUpdateBodySchema } from './model'
import { Service } from './service'
import { tags } from './tags'

export const posts = new Elysia({ prefix: '/posts' })
  .use(idModel)
  .use(paginationModel)
  .use(categories)
  .use(tags)
  .get('/', ({ query }) => Service.list(query), {
    query: 'pagination.query'
  })
  .post('/', ({ body }) => Service.create(body), {
    body: PostCreateBodySchema
  })
  .get('/:id', ({ params }) => Service.detail(params.id), {
    params: 'uuidv7'
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: PostUpdateBodySchema,
    params: 'uuidv7'
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
