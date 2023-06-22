import { EDGE_CONFIG } from '@/lib/keys'
import { CustomResponse } from '@/lib/server/response'
import { edgeFetch } from '@/lib/server/vercel-edge'
import { get } from '@vercel/edge-config'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export type Live2DGetResponseType = {
  src?: string
}

export const GET = async (request: NextRequest) => {
  try {
    const src = await get<string>(EDGE_CONFIG.LIVE2D_SRC)
    return CustomResponse.encrypt({ src })
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type Live2DPutRequestType = Live2DGetResponseType

export const PUT = async (request: NextRequest) => {
  try {
    const data: Live2DPutRequestType = await request.json()

    await edgeFetch([{ key: EDGE_CONFIG.LIVE2D_SRC, operation: 'upsert', value: data.src }])

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
