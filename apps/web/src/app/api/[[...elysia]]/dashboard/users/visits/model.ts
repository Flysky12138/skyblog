import { z } from 'zod'

export const VisitDeleteBodySchema = z.object({
  ids: z.coerce.number().array()
})
export type VisitDeleteBodyType = z.infer<typeof VisitDeleteBodySchema>
