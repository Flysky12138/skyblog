import { Elysia } from 'elysia'
import { z } from 'zod'

import { multipartUpload } from './multipart-upload'
import { Service } from './service'

export const objects = new Elysia({ prefix: '/objects' }).use(multipartUpload).get('/:key', ({ params }) => Service.detail(params.key), {
  params: z.strictObject({
    key: z.hash('sha256')
  })
})
