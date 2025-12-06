import { z } from 'zod'

export const TagCreateBodySchema = z.strictObject({
  name: z.string().nonempty()
})
export type TagCreateBodyType = z.infer<typeof TagCreateBodySchema>

export const TagUpdateBodySchema = z.strictObject({
  name: z.string().nonempty()
})
export type TagUpdateBodyType = z.infer<typeof TagUpdateBodySchema>
