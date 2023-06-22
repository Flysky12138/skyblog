import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const dbGet = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  })
}

export type GET = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbGet>>
}>

export const GET = async () => {
  try {
    const res = await dbGet()
    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
