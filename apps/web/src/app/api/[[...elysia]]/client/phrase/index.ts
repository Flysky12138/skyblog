import { Elysia } from 'elysia'
import { z } from 'zod'

import { PhraseDetailResponseSchema, PhraseDetailResponseType } from './model'

export const phrase = new Elysia({ prefix: '/phrase' }).get(
  '/',
  async ({ status }) => {
    const res = await fetch('https://v1.hitokoto.cn')

    if (!res.ok) {
      return status(500, { message: 'Failed to fetch hitokoto' })
    }

    const data = (await res.json()) as PhraseDetailResponseType

    return data
  },
  {
    response: {
      200: PhraseDetailResponseSchema,
      500: z.object({ message: z.string() })
    }
  }
)
