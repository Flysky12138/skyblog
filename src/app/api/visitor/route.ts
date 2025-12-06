import { after, NextRequest } from 'next/server'

import { getUserVisitInfo } from '@/lib/http/headers'
import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/prisma/client'

const dbPost = async (data: Prisma.ActivityLogCreateInput) => {
  return prisma.activityLog.create({ data })
}

export const POST = async (request: NextRequest) => {
  try {
    const VISITED = 'visited'

    if (request.cookies.has(VISITED)) {
      return new Response()
    }

    after(async () => {
      const visitInfo = getUserVisitInfo(request)
      await dbPost(visitInfo)
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
