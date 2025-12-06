import { z } from 'zod'

export const PhraseDetailResponseSchema = z.strictObject({
  from: z.string(),
  hitokoto: z.string().optional()
})
export type PhraseDetailResponseType = z.infer<typeof PhraseDetailResponseSchema>
