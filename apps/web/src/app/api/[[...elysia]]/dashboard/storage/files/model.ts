import { z } from 'zod'

export const fileMetadataSchema = z
  .strictObject({
    height: z.number().optional(),
    width: z.number().optional()
  })
  .optional()
export type FileMetadataType = z.infer<typeof fileMetadataSchema>

export const StorageFileCreateBodySchema = z.strictObject({
  directory: z.strictObject({
    id: z.uuidv7(),
    names: z.string().nonempty().array().optional()
  }),
  file: z.strictObject({
    ext: z.string().nonempty(),
    metadata: fileMetadataSchema,
    mimeType: z.string(),
    name: z.string().nonempty(),
    size: z.int().positive()
  }),
  s3Object: z.strictObject({
    bucket: z.string().nonempty(),
    objectKey: z.hash('sha256'),
    region: z.string().nullish()
  })
})
export type StorageFileCreateBodyType = z.infer<typeof StorageFileCreateBodySchema>
