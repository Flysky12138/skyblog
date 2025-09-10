import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

export const revalidate = 15

const dbGet = async (id: string) => {
  return prisma.post.findUnique({
    select: {
      categories: true,
      createdAt: true,
      links: true,
      published: true,
      updatedAt: true,
      views: true
    },
    where: { id }
  })
}

export type GET = RouteHandlerType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
  search: {
    id: string
  }
}>

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return await CustomResponse.error('{id} 值缺失', 400)

    const res = await dbGet(id)
    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
