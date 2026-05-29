import { Elysia } from 'elysia'
import { z } from 'zod'

import { AlbumResponseSchema, PlaylistResponseSchema, SearchQuerySchema, SearchResponseSchema } from './model'
import { Service } from './service'
import { songs } from './songs'

export const neteaseCloudMusic = new Elysia({ prefix: '/netease-cloud-music' })
  .use(songs)
  .model({
    id: z.object({
      id: z.coerce.number().int().positive()
    })
  })
  .get('/album/:id', async ({ params }) => Service.album(params.id), {
    params: 'id',
    response: {
      200: AlbumResponseSchema
    }
  })
  .get('/playlist/:id', async ({ params }) => Service.playlist(params.id), {
    params: 'id',
    response: {
      200: PlaylistResponseSchema
    }
  })
  .get('/search', async ({ query }) => Service.search(query), {
    query: SearchQuerySchema,
    response: {
      200: SearchResponseSchema
    }
  })
