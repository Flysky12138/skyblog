import { REDIS } from '@/lib/constants'
import { ImageFileInfoType } from '@/lib/file/info'
import { CustomResponse } from '@/lib/server/response'
import { kv } from '@vercel/kv'
import { NextRequest } from 'next/server'

export type GET = MethodRequestType<{
  return: {
    data: Record<string, POST['body']['value']>
  }
}>
export type POST = MethodRequestType<{
  body: {
    key: string
    value: ImageFileInfoType
  }
}>
export type DELETE = MethodRequestType<{
  body: Pick<POST['body'], 'key'>
}>

export const GET = async () => {
  try {
    const data = await kv.json.get(REDIS.IMAGES)
    return CustomResponse.encrypt({ data })
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const { key, value }: POST['body'] = await request.json()

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
    const { key }: DELETE['body'] = await request.json()

    if (!key) CustomResponse.error('{key} 值缺失', 422)

    const data = await kv.json.del(REDIS.IMAGES, `$.${key}`)
    if (data == 0) return CustomResponse.error('Redis 上不存在目标资源，或删除资源失败')

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
