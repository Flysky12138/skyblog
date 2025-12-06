import { z } from 'zod'

export const CategoryCreateBodySchema = z.strictObject({
  name: z.string().nonempty()
})
export type CategoryCreateBodyType = z.infer<typeof CategoryCreateBodySchema>

export const CategoryUpdateBodySchema = z.strictObject({
  name: z.string().nonempty()
})
export type CategoryUpdateBodyType = z.infer<typeof CategoryUpdateBodySchema>
