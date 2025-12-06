import { NextRequest } from 'next/server'
import { PageNumberPaginationOptions } from 'prisma-extension-pagination'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'
import { VisitorLog } from '@/prisma/client'

const dbGet = async (payload: GET['search']) => {
  const [visitors, pagination] = await prisma.visitorLog
    .paginate({
      orderBy: {
        createdAt: 'desc'
      }
    })
    .withPages(payload)

  return {
    pagination,
    visitors
  }
}

export type GET = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbGet>>
  search: PageNumberPaginationOptions
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
