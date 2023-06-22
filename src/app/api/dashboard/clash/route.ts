import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

const include = Prisma.validator<Prisma.ClashInclude>()({
  visitorInfos: {
    orderBy: {
      createdAt: 'asc'
    }
  }
})

// 获取
const dbGet = async () => {
  return await prisma.clash.findMany({
    include,
    orderBy: { createdAt: 'desc' }
  })
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
export interface ClashPostRequestType extends Prisma.ClashCreateInput {}

const dbPost = async (data: ClashPostRequestType) => {
  return await prisma.clash.create({ data, include })
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

// 修改
const dbPut = async (id: string, data: ClashPostRequestType) => {
  return await prisma.clash.update({
    data: {
      ...data,
      updatedAt: new Date().toISOString()
    },
    include,
    where: { id }
  })
}

export const PUT = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await request.json()
    const res = await dbPut(id, data)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

// 删除
const dbDelete = async (id: string) => {
  return await prisma.clash.delete({ include, where: { id } })
}

export const DELETE = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbDelete(id)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type ClashGetResponseType = Prisma.PromiseReturnType<typeof dbGet>
export type ClashPostResponseType = Prisma.PromiseReturnType<typeof dbPost>
export type ClashPutResponseType = Prisma.PromiseReturnType<typeof dbPut>
export type ClashDeleteResponseType = Prisma.PromiseReturnType<typeof dbDelete>
