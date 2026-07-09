import { Elysia } from 'elysia'

import { Service } from '../../dashboard/crons/service'
import { idModel } from '../../model'

export const crons = new Elysia({ prefix: '/crons' }).use(idModel).get('/:id', ({ params }) => Service.run(params.id), {
  params: 'uuidv7'
})
