import { z } from 'zod'

export const PostCreateBodySchema = z.strictObject({
  authorId: z.uuidv7(),
  categories: z.string().nonempty().array().nullish(),
  content: z.string().nullish(),
  isPublished: z.boolean().optional(),
  pinOrder: z.int().optional(),
  summary: z.string().nullish(),
  tags: z.string().nonempty().array().nullish(),
  title: z.string().nonempty(),
  visibilityMask: z.int().optional()
})
export type PostCreateBodyType = z.infer<typeof PostCreateBodySchema>

export const PostUpdateBodySchema = z.strictObject({
  categories: z.string().nonempty().array().nullish(),
  content: z.string().nullish(),
  isPublished: z.boolean().optional(),
  pinOrder: z.int().optional(),
  summary: z.string().nullish(),
  tags: z.string().nonempty().array().nullish(),
  title: z.string().nonempty().optional(),
  updatedAt: z.iso.datetime().optional(),
  visibilityMask: z.int().optional()
})
export type PostUpdateBodyType = z.infer<typeof PostUpdateBodySchema>
