import { ImageFileInfoType } from '@/lib/fileInfo'
import { REDIS } from '@/lib/keys'
import { CustomResponse } from '@/lib/server/response'
import { kv } from '@vercel/kv'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export const GET = async () => {
  try {
    const data = await kv.json.get(REDIS.IMAGES)
    return CustomResponse.encrypt({ data })
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type ImageInfoGetResponseType = {
  data: Record<string, ImageInfoPostRequest['value']>
}

export interface ImageInfoPostRequest {
  key: string
  value: ImageFileInfoType
}

export const POST = async (request: NextRequest) => {
  try {
    const { key, value }: ImageInfoPostRequest = await request.json()

    if (!key) CustomResponse.error('{key} 值缺失', 422)
    if (!value) CustomResponse.error('{value} 值缺失', 422)

    const data = await kv.json.set(REDIS.IMAGES, `$.${key}`, value)

    return CustomResponse.encrypt({ data })
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const { key }: Pick<ImageInfoPostRequest, 'key'> = await request.json()

    if (!key) CustomResponse.error('{key} 值缺失', 422)

    const data = await kv.json.del(REDIS.IMAGES, `$.${key}`)
    if (data == 0) return CustomResponse.error('Redis 上不存在目标资源，或删除资源失败')

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
