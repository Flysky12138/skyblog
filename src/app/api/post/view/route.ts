import { NextRequest } from 'next/server'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const dbPost = async (id: string) => {
  return prisma.post.update({
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

export type POST = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbPost>>
  search: {
    id: string
  }
}>

export const POST = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const res = await dbPost(id)
    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
