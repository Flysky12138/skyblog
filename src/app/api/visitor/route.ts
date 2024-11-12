import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { Geo } from '@vercel/functions'
import { NextRequest, userAgent } from 'next/server'
import { convertVisitorLogSaveData } from '../dashboard/users/visitor/utils'

export const runtime = 'nodejs'

const dbPost = async (data: Prisma.VisitorLogCreateInput) => {
  return await prisma.visitorLog.create({ data })
}

export type POST = MethodRouteType<{
  body: {
    agent: ReturnType<typeof userAgent>
    geo: Geo
    ip: string
    referer: string | null
  }
}>

export const POST = async (request: NextRequest) => {
  try {
    const data: POST['body'] = await request.json()

    await dbPost(convertVisitorLogSaveData(data))

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
