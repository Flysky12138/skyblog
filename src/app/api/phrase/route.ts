import { NextRequest } from 'next/server'

import { CustomResponse } from '@/lib/http/response'

export type GET = RouteHandlerType<{
  return: {
    from: string
    hitokoto?: string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const res = await fetch('https://v1.hitokoto.cn')
    const data = await res.json()
    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
