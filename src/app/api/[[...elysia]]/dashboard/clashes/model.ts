import { z } from 'zod'

export const ClashCreateBodySchema = z.strictObject({
  content: z.string(),
  description: z.string().nullish(),
  name: z.string().nonempty(),
  templateId: z.uuidv7().nullish(),
  variables: z.record(z.string().nonempty(), z.any())
})
export type ClashCreateBodyType = z.infer<typeof ClashCreateBodySchema>

export const ClashUpdateBodySchema = z.strictObject({
  content: z.string().optional(),
  description: z.string().nullish(),
  isEnabled: z.boolean().optional(),
  name: z.string().nonempty().optional(),
  templateId: z.uuidv7().nullish(),
  variables: z.record(z.string().nonempty(), z.any()).optional()
})
export type ClashUpdateBodyType = z.infer<typeof ClashUpdateBodySchema>
