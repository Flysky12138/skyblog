import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { VisitorInfo } from '@prisma/client'
import { geolocation, ipAddress } from '@vercel/edge'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

interface VisitorPostRequest extends Omit<VisitorInfo, 'id' | 'createdAt'> {}

const dbPost = async (data: VisitorPostRequest) => {
  return await prisma.visitorInfo.create({ data })
}

export const POST = async (request: NextRequest) => {
  try {
    const ip = process.env.NODE_ENV == 'development' ? '1.1.1.1' : ipAddress(request)
    if (!ip) return CustomResponse.error('未知访问', 400)

    const { city = null, country = null, countryRegion = null, latitude = null, longitude = null } = geolocation(request)

    await dbPost({
      agent: request.headers.get('user-agent'),
      city,
      country,
      countryRegion,
      ip,
      latitude,
      longitude,
      referer: request.headers.get('referer')
    })

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
