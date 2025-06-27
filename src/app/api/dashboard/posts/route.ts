import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'
import { PaginationArgs } from 'prisma-paginate'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

import { include } from './prisma.config'

const dbGet = async (payload: NonNullable<GET['search']>) => {
  return await prisma.post.paginate(
    {
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        createdAt: true,
        description: true,
        id: true,
        published: true,
        title: true,
        updatedAt: true,
        ...include
      }
    },
    payload
  )
}

export type GET = RouteHandlerType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
  search?: PaginationArgs
}>

export const GET = async (request: NextRequest) => {
  try {
    const page = Number.parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '10')

    const res = await dbGet({ limit, page })
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
