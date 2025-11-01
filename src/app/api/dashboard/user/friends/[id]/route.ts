import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

import { CacheClear } from '@/lib/cache'
import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const dbPut = async (id: string, data: PUT['body']) => {
  return prisma.friend.update({ data, where: { id } })
}

export type PUT = RouteHandlerType<{
  body: Prisma.FriendCreateInput
  return: Awaited<ReturnType<typeof dbPut>>
}>

export const PUT = async (request: NextRequest, { params }: RouteContext<'/api/dashboard/user/friends/[id]'>) => {
  try {
    const { id } = await params

    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const data = await request.json()
    const res = await dbPut(id, data)

    CacheClear.friend()

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbDelete = async (id: string) => {
  return prisma.friend.delete({
    where: { id }
  })
}

export type DELETE = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbDelete>>
}>

export const DELETE = async (request: NextRequest, { params }: RouteContext<'/api/dashboard/user/friends/[id]'>) => {
  try {
    const { id } = await params

    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const res = await dbDelete(id)

    CacheClear.friend()

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
