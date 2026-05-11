import { z } from 'zod'

export const StorageFileCreateBodySchema = z.strictObject({
  directory: z.strictObject({
    id: z.uuidv7(),
    names: z.string().nonempty().array().optional()
  }),
  file: z.strictObject({
    ext: z.string().nonempty(),
    metadata: z.record(z.string().nonempty(), z.any()).optional(),
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
