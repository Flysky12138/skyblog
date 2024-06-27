import { EDGE_CONFIG } from '@/lib/constants'
import { CustomResponse } from '@/lib/server/response'
import { edgeFetch } from '@/lib/server/vercel-edge'
import { getAll } from '@vercel/edge-config'
import { NextRequest } from 'next/server'

export type EdgeBanKeysType = (typeof EDGE_CONFIG)[keyof PickStartsWith<typeof EDGE_CONFIG, 'BAN'>]

export type GET = MethodRequestType<{
  return: Partial<Record<EdgeBanKeysType, string[]>>
}>
export type PUT = MethodRequestType<{
  body: {
    key: EdgeBanKeysType
    value: string[]
  }
}>

export const GET = async (CustomRequest: NextRequest) => {
  try {
    const data = await getAll<Partial<Record<(typeof EDGE_CONFIG)[keyof typeof EDGE_CONFIG], any>>>()

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

export const PUT = async (CustomRequest: NextRequest) => {
  try {
    const { key, value }: PUT['body'] = await CustomRequest.json()

    await edgeFetch([{ key, operation: 'upsert', value }])

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
