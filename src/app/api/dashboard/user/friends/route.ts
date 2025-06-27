import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

import { CacheClear } from '@/lib/cache'
import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const dbGet = async () => {
  return await prisma.friend.findMany()
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

const dbPost = async (data: POST['body']) => {
  return await prisma.friend.create({
    data
  })
}

export type POST = RouteHandlerType<{
  body: Prisma.FriendCreateInput
  return: Prisma.PromiseReturnType<typeof dbPost>
}>

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json()
    const res = await dbPost(data)

    CacheClear.friends()

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
