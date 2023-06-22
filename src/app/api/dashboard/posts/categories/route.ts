import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'

const dbGet = async () => {
  return await prisma.category.findMany()
}

export type GET = RouteHandlerType<{
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
