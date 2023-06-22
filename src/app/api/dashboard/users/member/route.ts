import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export type GET = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
}>

const dbGet = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  })
}

export const GET = async () => {
  try {
    const res = await dbGet()
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
