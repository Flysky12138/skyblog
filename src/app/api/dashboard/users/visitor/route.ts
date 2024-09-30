import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'
import { PaginationArgs } from 'prisma-paginate'
import { convertVisitorLogGetData } from './utils'

export type GET = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
  search: PaginationArgs
}>

const dbGet = async (payload: GET['search']) => {
  const { result, totalPages, ...data } = await prisma.visitorLog.paginate(
    {
      orderBy: {
        createdAt: 'desc'
      }
    },
    payload
  )
  return {
    ...data,
    totalPages,
    result: result.map(convertVisitorLogGetData)
  }
}

export const GET = async (request: NextRequest) => {
  try {
    const page = Number.parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '50')

    const res = await dbGet({ limit, page })
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
