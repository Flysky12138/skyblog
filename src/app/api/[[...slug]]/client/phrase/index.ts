import { Elysia } from 'elysia'
import { z } from 'zod'

import { PhraseDetailResponseSchema } from './model'

export const phrase = new Elysia({ prefix: '/phrase' }).get(
  '/',
  async ({ status }) => {
    const res = await fetch('https://v1.hitokoto.cn')

    if (!res.ok) return status(500, 'Failed to fetch hitokoto')

    return res.json()
  },
  {
    response: {
      200: PhraseDetailResponseSchema,
      500: z.string()
    }
  }
)
