import z from 'zod'

export const VisitCreateBodySchema = z.strictObject({
  browser: z.string().max(20).nullish(),
  countryCode: z.string().max(2).nullish(),
  geo: z.record(z.string().nonempty(), z.any()).optional(),
  ip: z.union([z.ipv4(), z.ipv6()]),
  os: z.string().max(20).nullish(),
  referer: z.string().max(120).nullish()
})
export type VisitCreateBodyType = z.infer<typeof VisitCreateBodySchema>
