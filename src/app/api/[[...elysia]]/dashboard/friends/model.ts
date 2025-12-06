import { z } from 'zod'

export const FriendCreateBodySchema = z.strictObject({
  description: z.string().nullish(),
  isActive: z.boolean().optional(),
  name: z.string().nonempty(),
  order: z.int().positive().optional(),
  siteUrl: z.url()
})
export type FriendCreateBodyType = z.infer<typeof FriendCreateBodySchema>

export const FriendUpdateBodySchema = z.strictObject({
  description: z.string().nullish(),
  isActive: z.boolean().optional(),
  name: z.string().nonempty(),
  order: z.int().positive().optional(),
  siteUrl: z.url()
})
export type FriendUpdateBodyType = z.infer<typeof FriendUpdateBodySchema>
