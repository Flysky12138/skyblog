import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const dbPost = async (id: string) => {
  return await prisma.post.update({
    data: {
      views: {
        increment: 1
      }
    },
    where: {
      id,
      published: true
    }
  })
}

export type POST = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbPost>
  search: {
    id: string
  }
}>

export const POST = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbPost(id)
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
