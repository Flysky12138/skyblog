import { Elysia } from 'elysia'
import { after } from 'next/server'

import { getUserVisitInfo } from '@/lib/http/headers'

import { Service } from './service'

export const visits = new Elysia({ prefix: '/visits' }).post('/', async ({ cookie, request, set, status }) => {
  const VISITED = 'visited'

  if (VISITED in cookie) return status(200, 'OK')

  after(async () => {
    const visitInfo = getUserVisitInfo(request)
    await Service.create(visitInfo)
  })

  set.cookie = {
    [VISITED]: {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: true,
      value: true
    }
  }

  return status(201, 'Created')
})
