import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { geolocation, ipAddress } from '@vercel/functions'
import { NextRequest, userAgent } from 'next/server'
import { convertVisitorLogSaveData } from '../dashboard/users/visitor/utils'

export const runtime = 'nodejs'

const dbPost = async (data: Prisma.VisitorLogCreateInput) => {
  return await prisma.visitorLog.create({ data })
}

export const POST = async (request: NextRequest) => {
  try {
    const ip = process.env.NODE_ENV == 'development' ? '0.0.0.0' : ipAddress(request)
    if (!ip) return CustomResponse.error('未知访问', 400)

    const agent = userAgent(request)
    const geo = geolocation(request)

    await dbPost(
      convertVisitorLogSaveData({
        agent,
        geo,
        ip,
        referer: request.headers.get('referer')
      })
    )

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
