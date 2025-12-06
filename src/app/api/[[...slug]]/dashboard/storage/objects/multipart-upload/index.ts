import { Elysia } from 'elysia'

import {
  StorageObjectMultipartUploadAbortBodySchema,
  StorageObjectMultipartUploadCompleteBodySchema,
  StorageObjectMultipartUploadCreateBodySchema,
  StorageObjectMultipartUploadSignPartBodySchema
} from './model'
import { Service } from './service'

export const multipartUpload = new Elysia({ prefix: '/multipart-upload' })
  .post('/abort', ({ body }) => Service.abort(body), {
    body: StorageObjectMultipartUploadAbortBodySchema
  })
  .post('/complete', ({ body }) => Service.complete(body), {
    body: StorageObjectMultipartUploadCompleteBodySchema
  })
  .post('/create', ({ body }) => Service.create(body), {
    body: StorageObjectMultipartUploadCreateBodySchema
  })
  .post('/sign-part', ({ body }) => Service.signPart(body), {
    body: StorageObjectMultipartUploadSignPartBodySchema
  })
