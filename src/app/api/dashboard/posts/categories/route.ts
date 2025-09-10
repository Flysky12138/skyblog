import { Prisma } from '@prisma/client'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const dbGet = async () => {
  return prisma.category.findMany()
}

export type GET = RouteHandlerType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
}>

export const GET = async () => {
  try {
    const res = await dbGet()
    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
