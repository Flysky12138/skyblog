import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

const select = Prisma.validator<Prisma.ClashTemplateSelect>()({
  id: true,
  name: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      clashs: true
    }
  }
})

// 获取
const dbGet = async () => {
  return await prisma.clashTemplate.findMany({
    select,
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
export interface ClashTemplatePostRequest extends Prisma.ClashTemplateCreateInput {}

const dbPost = async (data: ClashTemplatePostRequest) => {
  return await prisma.clashTemplate.create({ data, select })
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
export interface ClashTemplatePutRequest extends Pick<Prisma.ClashTemplateUpdateInput, 'name' | 'content'> {}

const dbPut = async (id: number, data: ClashTemplatePutRequest) => {
  return await prisma.clashTemplate.update({
    data,
    select,
    where: { id }
  })
}

export const PUT = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await request.json()
    const res = await dbPut(Number.parseInt(id), data)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

// 删除
const dbDelete = async (id: number) => {
  return await prisma.clashTemplate.delete({ select, where: { id } })
}

export const DELETE = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbDelete(Number.parseInt(id))

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type ClashTemplateGetResponseType = Prisma.PromiseReturnType<typeof dbGet>
export type ClashTemplatePostResponseType = Prisma.PromiseReturnType<typeof dbPost>
export type ClashTemplatePutResponseType = Prisma.PromiseReturnType<typeof dbPut>
export type ClashTemplateDeleteResponseType = Prisma.PromiseReturnType<typeof dbDelete>
