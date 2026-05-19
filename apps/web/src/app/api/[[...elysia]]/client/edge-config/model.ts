import { z } from 'zod'

import { VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'

export const EdgeConfigQuerySchema = z.strictObject({
  key: z.enum(VERCEL_EDGE_CONFIG_KEY)
})
export type EdgeConfigQueryType = z.infer<typeof EdgeConfigQuerySchema>

export const EdgeConfigDetailResponseSchema = z.strictObject({
  key: z.enum(VERCEL_EDGE_CONFIG_KEY).optional(),
  value: z.string()
})
export type EdgeConfigDetailResponseType = z.infer<typeof EdgeConfigDetailResponseSchema>
