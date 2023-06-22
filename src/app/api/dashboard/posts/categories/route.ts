import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

const dbGet = async () => {
  return await prisma.category.findMany({})
}

export const GET = async () => {
  try {
    const res = await dbGet()
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type CategoriesGetResponseType = Prisma.PromiseReturnType<typeof dbGet>
