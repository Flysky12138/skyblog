import { Elysia } from 'elysia'

import { uuidModel } from '../../../model'
import { multipartUpload } from './multipart-upload'
import { Service } from './service'

export const objects = new Elysia({ prefix: '/objects' })
  .use(uuidModel)
  .use(multipartUpload)
  .get('/:id', ({ params }) => Service.detail(params.id), {
    params: 'uuidv7'
  })
