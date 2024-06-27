import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { VisitorInfo } from '@prisma/client'
import { geolocation, ipAddress } from '@vercel/edge'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const dbPost = async (data: Omit<VisitorInfo, 'id' | 'createdAt'>) => {
  return await prisma.visitorInfo.create({ data })
}

export const POST = async (CustomRequest: NextRequest) => {
  try {
    const ip = process.env.NODE_ENV == 'development' ? '1.1.1.1' : ipAddress(CustomRequest)
    if (!ip) return CustomResponse.error('未知访问', 400)

    const { city = null, country = null, countryRegion = null, latitude = null, longitude = null } = geolocation(CustomRequest)

    await dbPost({
      agent: CustomRequest.headers.get('user-agent'),
      city,
      country,
      countryRegion,
      ip,
      latitude,
      longitude,
      referer: CustomRequest.headers.get('referer')
    })

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
