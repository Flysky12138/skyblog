import { z } from 'zod'

export const VisitCreateBodySchema = z.strictObject({
  browser: z.string().nullish(),
  countryCode: z.string().nullish(),
  geo: z.record(z.string().nonempty(), z.any()).optional(),
  ip: z.union([z.ipv4(), z.ipv6()]),
  os: z.string().nullish(),
  referer: z.string().nullish()
})
export type VisitCreateBodyType = z.infer<typeof VisitCreateBodySchema>
