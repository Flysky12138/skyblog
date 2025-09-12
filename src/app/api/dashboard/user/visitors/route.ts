import { VisitorLog } from '@prisma/client'
import { NextRequest } from 'next/server'
import { PaginationArgs } from 'prisma-paginate'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const dbGet = async (payload: GET['search']) => {
  return prisma.visitorLog.paginate(
    {
      orderBy: {
        createdAt: 'desc'
      }
    },
    payload
  )
}

export type GET = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbGet>>
  search: PaginationArgs
}>

export const GET = async (request: NextRequest) => {
  try {
    const page = Number.parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '50')

    const res = await dbGet({ limit, page })
    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbDelete = async (payload: DELETE['body']) => {
  return prisma.visitorLog.deleteMany({
    where: {
      id: {
        in: payload.ids
      }
    }
  })
}

export type DELETE = RouteHandlerType<{
  body: {
    ids: VisitorLog['id'][]
  }
  return: Awaited<ReturnType<typeof dbDelete>>
}>

export const DELETE = async (request: NextRequest) => {
  try {
    const { ids }: DELETE['body'] = await request.json()

    const res = await dbDelete({ ids })
    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
