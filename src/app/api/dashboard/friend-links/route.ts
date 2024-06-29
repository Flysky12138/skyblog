import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

export type GET = MethodRequestType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
}>
export type POST = MethodRequestType<{
  body: Prisma.FriendLinksCreateInput
  return: Prisma.PromiseReturnType<typeof dbPost>
}>

// 获取
const dbGet = async () => {
  return await prisma.friendLinks.findMany()
}

export const GET = async () => {
  try {
    const res = await dbGet()
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

// 创建
const dbPost = async (data: POST['body']) => {
  return await prisma.friendLinks.create({
    data
  })
}

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json()
    const res = await dbPost(data)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
