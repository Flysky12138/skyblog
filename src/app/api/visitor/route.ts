import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { geolocation, ipAddress } from '@vercel/functions'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const dbPost = async (data: Prisma.VisitorInfoCreateInput) => {
  return await prisma.visitorInfo.create({ data })
}

export const POST = async (request: NextRequest) => {
  try {
    const ip = process.env.NODE_ENV == 'development' ? '0.0.0.0' : ipAddress(request)
    if (!ip) return CustomResponse.error('未知访问', 400)

    const { city = null, country = null, countryRegion = null, latitude = null, longitude = null } = geolocation(request)

    await dbPost({
      city,
      country,
      countryRegion,
      ip,
      latitude,
      longitude,
      agent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    })

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
