import { Elysia } from 'elysia'
import { after } from 'next/server'

import { getUserVisitInfo } from '@/lib/http/headers'

import { Service } from './service'

export const visits = new Elysia({ prefix: '/visits' }).post('/', ({ cookie, request, set, status }) => {
  const VISITED = 'visited'

  if (VISITED in cookie) {
    return status(200, { message: '已访问' })
  }

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

  return status(201, { message: '访问成功' })
})
