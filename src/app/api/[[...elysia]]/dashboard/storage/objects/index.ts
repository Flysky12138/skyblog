import { Elysia } from 'elysia'

import { idModel } from '../../../model'
import { multipartUpload } from './multipart-upload'
import { Service } from './service'

export const objects = new Elysia({ prefix: '/objects' })
  .use(idModel)
  .use(multipartUpload)
  .get('/:id', ({ params }) => Service.detail(params.id), {
    params: 'sha256'
  })
