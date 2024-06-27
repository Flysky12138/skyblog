import { EDGE_CONFIG } from '@/lib/constants'
import { CustomResponse } from '@/lib/server/response'
import { edgeFetch } from '@/lib/server/vercel-edge'
import { get } from '@vercel/edge-config'
import { NextRequest } from 'next/server'

export type GET = MethodRequestType<{
  return: {
    src?: string
  }
}>
export type PUT = MethodRequestType<{
  body: {
    src: string
  }
}>

export const GET = async (CustomRequest: NextRequest) => {
  try {
    const src = await get<string>(EDGE_CONFIG.LIVE2D_SRC)
    return CustomResponse.encrypt({ src })
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export const PUT = async (CustomRequest: NextRequest) => {
  try {
    const data: PUT['body'] = await CustomRequest.json()

    await edgeFetch([{ key: EDGE_CONFIG.LIVE2D_SRC, operation: 'upsert', value: data.src }])

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
