import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { CustomResponse } from '@/lib/server/response'
import { VercelEdgeFetch } from '@/lib/server/vercel-edge'
import { get } from '@vercel/edge-config'
import { NextRequest } from 'next/server'

export type GET = RouteHandlerType<{
  return: {
    src?: string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const src = await get<string>(VERCEL_EDGE_CONFIG.LIVE2D_SRC)
    return CustomResponse.encrypt({ src })
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type PUT = RouteHandlerType<{
  body: {
    src?: string
  }
}>

export const PUT = async (request: NextRequest) => {
  try {
    const data: PUT['body'] = await request.json()

    await VercelEdgeFetch([
      {
        key: VERCEL_EDGE_CONFIG.LIVE2D_SRC,
        operation: 'upsert',
        value: data.src
      }
    ])

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
