import { Prisma } from '@prisma/client'
import { geolocation, ipAddress } from '@vercel/functions'
import { after, NextRequest, userAgent } from 'next/server'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const dbPost = async (data: Prisma.VisitorLogCreateInput) => {
  return await prisma.visitorLog.create({ data })
}

export const POST = async (request: NextRequest) => {
  const VISITED = 'visited'
  try {
    if (request.cookies.has(VISITED)) {
      return new Response()
    }

    after(async () => {
      await dbPost({
        agent: userAgent(request),
        geo: geolocation(request),
        ip: ipAddress(request) || '',
        referer: request.headers.get('referer')
      })
    })

    return new Response(null, {
      headers: {
        'Set-Cookie': `${VISITED}=true; Path=/; httpOnly; sameSite=strict; secure`
      }
    })
  } catch (error) {
    return CustomResponse.error(error)
  }
}
