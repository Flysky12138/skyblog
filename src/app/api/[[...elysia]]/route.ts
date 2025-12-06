import { Elysia } from 'elysia'

import { HEADER_KEY } from '@/lib/constants'
import { AesGcm } from '@/lib/crypto'

import { client } from './client'
import { dashboard } from './dashboard'

export const app = new Elysia({ prefix: '/api' })
  .mapResponse(async ({ path, responseValue }) => {
    if (path.startsWith('/api/clashes')) return

    const { buffer, ivJwk } = await AesGcm.encrypt(responseValue)
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        [HEADER_KEY.AES_GCM_IVJWK]: ivJwk
      }
    })
  })
  .use(client)
  .use(dashboard)

export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const PATCH = app.fetch
export const DELETE = app.fetch
export const OPTIONS = app.fetch
export const HEAD = app.fetch
