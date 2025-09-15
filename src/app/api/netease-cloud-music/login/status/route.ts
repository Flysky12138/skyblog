import { get } from '@vercel/edge-config'
import { createRequire } from 'module'
import NeteaseCloudMusicApi from 'NeteaseCloudMusicApi'
import { NextRequest } from 'next/server'

import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { CustomResponse } from '@/lib/http/response'

const require = createRequire(import.meta.url)
const { login_status } = require('NeteaseCloudMusicApi') as typeof NeteaseCloudMusicApi

export type GET = RouteHandlerType<{
  return: {}
}>

export const GET = async (request: NextRequest) => {
  try {
    const data = await login_status({
      cookie: await get(VERCEL_EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE)
    })
      .then((res: any) => res.body.data)
      .catch(error => Promise.reject(error.body.message))

    return await CustomResponse.encrypt(data)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
