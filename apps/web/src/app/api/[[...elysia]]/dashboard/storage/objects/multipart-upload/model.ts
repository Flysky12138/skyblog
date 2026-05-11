import { z } from 'zod'

export const StorageObjectMultipartUploadAbortBodySchema = z.strictObject({
  key: z.string().nonempty(),
  uploadId: z.string().nonempty()
})
export type StorageObjectMultipartUploadAbortBodyType = z.infer<typeof StorageObjectMultipartUploadAbortBodySchema>

export const StorageObjectMultipartUploadCompleteBodySchema = z.strictObject({
  key: z.string().nonempty(),
  uploadId: z.string().nonempty(),
  parts: z
    .strictObject({
      ETag: z.string().nonempty().optional(),
      PartNumber: z.int().positive()
    })
    .array()
    .nonempty()
})
export type StorageObjectMultipartUploadCompleteBodyType = z.infer<typeof StorageObjectMultipartUploadCompleteBodySchema>

export const StorageObjectMultipartUploadCreateBodySchema = z.strictObject({
  contentType: z.string().nonempty(),
  key: z.string().nonempty()
})
export type StorageObjectMultipartUploadCreateBodyType = z.infer<typeof StorageObjectMultipartUploadCreateBodySchema>

export const StorageObjectMultipartUploadSignPartBodySchema = z.strictObject({
  key: z.string().nonempty(),
  partNumber: z.int().positive(),
  uploadId: z.string().nonempty()
})
export type StorageObjectMultipartUploadSignPartBodyType = z.infer<typeof StorageObjectMultipartUploadSignPartBodySchema>
