import { NextRequest } from 'next/server'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'
import { Prisma, Role } from '@/prisma/client'

const dbPost = async (data: POST['body']) => {
  const count = await prisma.user.count()
  if (count == 0) {
    data.role = Role.ADMIN
  }

  return prisma.user.upsert({
    create: data,
    update: data,
    where: { email: data.email }
  })
}

export type POST = RouteHandlerType<{
  body: Prisma.UserCreateInput
  return: Awaited<ReturnType<typeof dbPost>>
}>

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json()
    const res = await dbPost(data)

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
