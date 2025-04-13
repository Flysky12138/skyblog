import { CustomResponse } from '@/lib/http/response'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const dbGet = async () => {
  return await prisma.tag.findMany()
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
