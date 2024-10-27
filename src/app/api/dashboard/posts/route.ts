import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { include } from './prisma.config'

export const dynamic = 'force-dynamic'

const dbGet = async () => {
  return await prisma.post.findMany({
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
}

export type GET = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
}>

export const GET = async () => {
  try {
    const res = await dbGet()
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
