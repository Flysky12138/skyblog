import { z } from 'zod'

export const PostCreateBodySchema = z.strictObject({
  authorId: z.uuidv4(),
  categories: z.string().array().nullish(),
  content: z.string().nullish(),
  isPublished: z.boolean().optional(),
  pinOrder: z.int().optional(),
  summary: z.string().nullish(),
  tags: z.string().array().nullish(),
  title: z.string().nonempty(),
  visibilityMask: z.int().optional(),
  slug: z
    .string()
    .nonempty()
    .regex(/^[\w-]+$/)
    .nullish()
})
export type PostCreateBodyType = z.infer<typeof PostCreateBodySchema>

export const PostUpdateBodySchema = z.strictObject({
  categories: z.string().array().nullish(),
  content: z.string().nullish(),
  isPublished: z.boolean().optional(),
  pinOrder: z.int().optional(),
  summary: z.string().nullish(),
  tags: z.string().array().nullish(),
  title: z.string().nonempty().optional(),
  updatedAt: z.iso.datetime().optional(),
  visibilityMask: z.int().optional(),
  slug: z
    .string()
    .nonempty()
    .regex(/^[\w-]+$/)
    .nullish()
})
export type PostUpdateBodyType = z.infer<typeof PostUpdateBodySchema>
