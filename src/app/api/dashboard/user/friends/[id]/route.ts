import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

import { CacheClear } from '@/lib/cache'
import { CustomResponse } from '@/lib/http/response'
import prisma from '@/lib/prisma'

const dbPut = async (id: string, data: PUT['body']) => {
  return await prisma.friend.update({ data, where: { id } })
}

export type PUT = RouteHandlerType<{
  body: Prisma.FriendCreateInput
  return: Prisma.PromiseReturnType<typeof dbPut>
}>

export const PUT = async (request: NextRequest, { params }: DynamicRouteProps<{ id: string }>) => {
  try {
    const { id } = await params

    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await request.json()
    const res = await dbPut(id, data)

    CacheClear.friends()

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbDelete = async (id: string) => {
  return await prisma.friend.delete({
    where: { id }
  })
}

export type DELETE = RouteHandlerType<{
  return: Prisma.PromiseReturnType<typeof dbDelete>
}>

export const DELETE = async (request: NextRequest, { params }: DynamicRouteProps<{ id: string }>) => {
  try {
    const { id } = await params

    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbDelete(id)

    CacheClear.friends()

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
