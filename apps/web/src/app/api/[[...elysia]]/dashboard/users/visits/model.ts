import z from 'zod'

export const VisitDeleteBodySchema = z.object({
  ids: z.coerce.bigint().array().min(1).max(100)
})
export type VisitDeleteBodyType = z.infer<typeof VisitDeleteBodySchema>
