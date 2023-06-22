import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'
import { convertVariable, parseVariable } from './lib'

const include = Prisma.validator<Prisma.ClashInclude>()({
  visitorInfos: {
    orderBy: {
      createdAt: 'desc'
    }
  }
})

// 获取
const dbGet = async () => {
  const data = await prisma.clash.findMany({
    include,
    orderBy: { createdAt: 'desc' }
  })
  return data.map(parseVariable)
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
export interface ClashPostRequest extends Omit<Prisma.ClashUncheckedCreateInput, 'variables'> {
  variables: object
}

const dbPost = async (data: ClashPostRequest) => {
  return parseVariable(
    await prisma.clash.create({
      data: convertVariable(data),
      include
    })
  )
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
export interface ClashPutRequest extends Pick<Prisma.ClashUncheckedCreateInput, 'name' | 'subtitle' | 'content' | 'clashTemplateId'> {
  variables: object
}

const dbPut = async (id: string, data: ClashPutRequest) => {
  return parseVariable(
    await prisma.clash.update({
      data: {
        ...convertVariable(data),
        updatedAt: new Date().toISOString()
      },
      include,
      where: { id }
    })
  )
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
  return parseVariable(await prisma.clash.delete({ include, where: { id } }))
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
