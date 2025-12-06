import { z } from 'zod'

export const ClashTemplateCreateBodySchema = z.strictObject({
  content: z.string(),
  name: z.string().nonempty()
})
export type ClashTemplateCreateBodyType = z.infer<typeof ClashTemplateCreateBodySchema>

export const ClashTemplateUpdateBodySchema = z.strictObject({
  content: z.string(),
  name: z.string().nonempty()
})
export type ClashTemplateUpdateBodyType = z.infer<typeof ClashTemplateUpdateBodySchema>
