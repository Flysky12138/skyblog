import { NextRequest } from 'next/server'

import { CustomFetch } from '@/lib/http/fetch'
import { CustomResponse } from '@/lib/http/response'

export const runtime = 'nodejs'

export type GET = RouteHandlerType<{
  return: {
    from: string
    hitokoto?: string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const data = await CustomFetch('https://v1.hitokoto.cn')
    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
