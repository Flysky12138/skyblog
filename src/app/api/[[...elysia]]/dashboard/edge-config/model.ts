import { z } from 'zod'

import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'

export const EdgeConfigBodySchema = z.strictObject({
  cacheTags: z.enum(CACHE_TAG.EDGE_CONFIG).array().nullish(),
  items: z
    .strictObject({
      key: z.enum(VERCEL_EDGE_CONFIG_KEY),
      operation: z.enum(['create', 'delete', 'update', 'upsert']),
      value: z.json()
    })
    .array()
    .nonempty()
})
export type EdgeConfigBodyType = z.infer<typeof EdgeConfigBodySchema>
