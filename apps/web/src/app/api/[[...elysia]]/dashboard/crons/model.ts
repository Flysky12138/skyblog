import { z } from 'zod'

export const CronCreateBodySchema = z.strictObject({
  content: z.string().nonempty(),
  isEnabled: z.boolean().optional(),
  name: z.string().nonempty()
})
export type CronCreateBodyType = z.infer<typeof CronCreateBodySchema>

export const CronUpdateBodySchema = z.strictObject({
  content: z.string().nonempty().optional(),
  isEnabled: z.boolean().optional(),
  name: z.string().nonempty().optional()
})
export type CronUpdateBodyType = z.infer<typeof CronUpdateBodySchema>
