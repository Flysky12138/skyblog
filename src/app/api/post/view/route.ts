import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export type POST = MethodRequestType<{
  search: {
    id: string
  }
  return: Prisma.PromiseReturnType<typeof dbPost>
}>

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

export const POST = async (CustomRequest: NextRequest) => {
  try {
    const id = CustomRequest.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbPost(id)
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
