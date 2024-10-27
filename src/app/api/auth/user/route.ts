import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

const dbPost = async (data: POST['body']) => {
  const count = await prisma.user.count()
  if (count == 0) data.role = 'ADMIN'

  return await prisma.user.upsert({
    create: data,
    update: data,
    where: { email: data.email }
  })
}

export type POST = MethodRouteType<{
  body: Prisma.UserCreateInput
  return: Prisma.PromiseReturnType<typeof dbPost>
}>

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json()
    const res = await dbPost(data)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
