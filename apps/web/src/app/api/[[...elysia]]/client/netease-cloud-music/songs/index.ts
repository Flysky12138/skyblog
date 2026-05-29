import { Elysia } from 'elysia'
import { z } from 'zod'

import { LyricResponseSchema, SongDetailResponseSchema, UrlQuerySchema, UrlResponseSchema } from './model'
import { Service } from './service'

export const songs = new Elysia({ prefix: '/songs' })
  .model({
    id: z.object({
      id: z.coerce.number().int().positive()
    })
  })
  .get('/:id', async ({ params }) => Service.detail(params.id), {
    params: 'id',
    response: {
      200: SongDetailResponseSchema
    }
  })
  .get('/:id/lyric', async ({ params }) => Service.lyric(params.id), {
    params: 'id',
    response: {
      200: LyricResponseSchema
    }
  })
  .get('/:id/url', async ({ params, query }) => Service.url(params.id, query), {
    params: 'id',
    query: UrlQuerySchema,
    response: {
      200: UrlResponseSchema
    }
  })
