import { CustomResponse } from '@/lib/http/response'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { Geo } from '@vercel/functions'
import { NextRequest, userAgent } from 'next/server'

const dbPost = async (data: Prisma.VisitorLogCreateInput) => {
  return await prisma.visitorLog.create({ data })
}

export type POST = RouteHandlerType<{
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

    await dbPost(data)

    return new Response()
  } catch (error) {
    return CustomResponse.error(error)
  }
}
