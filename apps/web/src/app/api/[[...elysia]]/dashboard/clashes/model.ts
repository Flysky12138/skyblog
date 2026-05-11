import { z } from 'zod'

export const ClashCreateBodySchema = z.strictObject({
  content: z.string().nonempty(),
  description: z.string().nullish(),
  name: z.string().nonempty().max(16),
  templateId: z.uuidv7().nullish(),
  variables: z.record(z.string().nonempty(), z.string().nonempty())
})
export type ClashCreateBodyType = z.infer<typeof ClashCreateBodySchema>

export const ClashUpdateBodySchema = z.strictObject({
  content: z.string().nonempty().optional(),
  description: z.string().nullish(),
  isEnabled: z.boolean().optional(),
  name: z.string().nonempty().max(16).optional(),
  templateId: z.uuidv7().nullish(),
  variables: z.record(z.string().nonempty(), z.string().nonempty()).optional()
})
export type ClashUpdateBodyType = z.infer<typeof ClashUpdateBodySchema>
