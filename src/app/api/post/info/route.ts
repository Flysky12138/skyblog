import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

const dbGet = async (id: string) => {
  return await prisma.post.findUnique({
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

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbGet(id)
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type PostInfoGetResponseType = Prisma.PromiseReturnType<typeof dbGet>
