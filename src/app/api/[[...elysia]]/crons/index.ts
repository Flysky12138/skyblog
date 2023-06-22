import { Elysia } from 'elysia'

export const crons = new Elysia({ prefix: '/crons' }).get('/', () => '1')
