import { Elysia } from 'elysia'

import { idModel } from '../../model'
import { CronCreateBodySchema, CronUpdateBodySchema } from './model'
import { Service } from './service'

export const crons = new Elysia({ prefix: '/crons' })
  .use(idModel)
  .get('/', () => Service.list())
  .post('/', ({ body }) => Service.create(body), {
    body: CronCreateBodySchema
  })
  .get('/:id', ({ params }) => Service.detail(params.id), {
    params: 'uuidv7'
  })
  .put('/:id', ({ body, params }) => Service.update(params.id, body), {
    body: CronUpdateBodySchema,
    params: 'uuidv7'
  })
  .delete('/:id', ({ params }) => Service.delete(params.id), {
    params: 'uuidv7'
  })
  .post('/:id/run', ({ params }) => Service.run(params.id), {
    params: 'uuidv7'
  })
