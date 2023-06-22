import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export type GET = MethodRouteType<{
  return: {
    from: string
    hitokoto: string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const data = await CustomFetch('https://v1.hitokoto.cn', {
      cache: 'no-cache'
    })
    return CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
