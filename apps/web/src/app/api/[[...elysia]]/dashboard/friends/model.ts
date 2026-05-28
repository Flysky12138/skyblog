import { z } from 'zod'

export const FriendCreateBodySchema = z.strictObject({
  description: z.string().nullish(),
  isEnabled: z.boolean().optional(),
  name: z.string().nonempty(),
  order: z.int().nonnegative().optional(),
  screenshotFileId: z.uuidv7().nullish(),
  siteUrl: z.httpUrl()
})
export type FriendCreateBodyType = z.infer<typeof FriendCreateBodySchema>

export const FriendUpdateBodySchema = z.strictObject({
  description: z.string().nullish(),
  isEnabled: z.boolean().optional(),
  name: z.string().nonempty().optional(),
  order: z.int().nonnegative().optional(),
  screenshotFileId: z.uuidv7().nullish(),
  siteUrl: z.httpUrl().optional()
})
export type FriendUpdateBodyType = z.infer<typeof FriendUpdateBodySchema>

export const FriendCoverBodySchema = z.strictObject({
  url: z.httpUrl()
})
export type FriendCoverBodyType = z.infer<typeof FriendCoverBodySchema>
