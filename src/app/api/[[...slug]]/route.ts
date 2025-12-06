import { Elysia } from 'elysia'

import { client } from './client'
import { dashboard } from './dashboard'

export const app = new Elysia({ prefix: '/api' }).use(client).use(dashboard)

export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const PATCH = app.fetch
export const DELETE = app.fetch
export const OPTIONS = app.fetch
export const HEAD = app.fetch
