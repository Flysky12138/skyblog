import { Elysia } from 'elysia'
import { z } from 'zod'

import {
  AlbumResponseSchema,
  LyricResponseSchema,
  PlaylistResponseSchema,
  SearchQuerySchema,
  SearchResponseSchema,
  SongUrlQuerySchema,
  SongUrlResponseSchema
} from './model'
import { Service } from './service'

export const neteaseCloudMusic = new Elysia({ prefix: '/netease-cloud-music' })
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
  .get('/lyric/:id', async ({ params }) => Service.lyric(params.id), {
    params: 'id',
    response: {
      200: LyricResponseSchema
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
  .get('/song/:id/url', async ({ params, query }) => Service.songUrl(params.id, query), {
    params: 'id',
    query: SongUrlQuerySchema,
    response: {
      200: SongUrlResponseSchema
    }
  })
