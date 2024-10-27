import { EDGE_CONFIG } from '@/lib/constants'
import { CustomResponse } from '@/lib/server/response'
import { edgeFetch } from '@/lib/server/vercel-edge'
import { getAll } from '@vercel/edge-config'
import { NextRequest } from 'next/server'

export type EdgeBanKeysType = (typeof EDGE_CONFIG)[keyof PickStartsWith<typeof EDGE_CONFIG, 'BAN'>]

export type GET = MethodRouteType<{
  return: Partial<Record<EdgeBanKeysType, string[]>>
}>

export const GET = async (request: NextRequest) => {
  try {
    const data = await getAll<Partial<Record<(typeof EDGE_CONFIG)[keyof typeof EDGE_CONFIG], string[]>>>()

    const res: GET['return'] = {
      'ban-agents': data['ban-agents'],
      'ban-cities': data['ban-cities'],
      'ban-countries': data['ban-countries'],
      'ban-country-regions': data['ban-country-regions'],
      'ban-ips': data['ban-ips'],
      'ban-referers': data['ban-referers']
    }

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type PUT = MethodRouteType<{
  body: {
    key: EdgeBanKeysType
    value: string[]
  }
}>

export const PUT = async (request: NextRequest) => {
  try {
    const { key, value }: PUT['body'] = await request.json()

    await edgeFetch([{ key, value, operation: 'upsert' }])

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
