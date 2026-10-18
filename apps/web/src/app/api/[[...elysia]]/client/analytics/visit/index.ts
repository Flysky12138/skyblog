import { Elysia } from 'elysia'
import { after } from 'next/server'

import { getUserVisitInfo } from '@/lib/http/headers'

import { authOptional } from '../../../plugins'
import { Service } from './service'

const VISIT_SESSION = 'visit_session'

export const visit = new Elysia({ prefix: '/visit' }).use(authOptional).post('/', ({ cookie, request, set, status, user }) => {
  if (VISIT_SESSION in cookie) {
    return status(200, { message: '本次访问已统计' })
  }

  after(async () => {
    if (user?.role === 'admin') return

    const visitInfo = getUserVisitInfo(request)
    await Service.create(visitInfo)
  })

  set.cookie = {
    [VISIT_SESSION]: {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      value: Date.now().toString()
    }
  }

  return status(201, { message: '访问统计成功' })
})
