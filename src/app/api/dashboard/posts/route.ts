import { NextRequest } from 'next/server'
import { PageNumberPaginationOptions } from 'prisma-extension-pagination'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

import { include } from './prisma.config'

const dbGet = async (payload: NonNullable<GET['search']>) => {
  const [posts, pagination] = await prisma.post
    .paginate({
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
    })
    .withPages(payload)

  return {
    pagination,
    posts
  }
}

export type GET = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbGet>>
  search?: PageNumberPaginationOptions
}>

export const GET = async (request: NextRequest) => {
  try {
    const page = Number.parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '10')

    const res = await dbGet({ limit, page })
    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
