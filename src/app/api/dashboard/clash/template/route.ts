import { CustomResponse } from '@/lib/http/response'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

const select = Prisma.validator<Prisma.ClashTemplateSelect>()({
  _count: {
    select: {
      clashs: true
    }
  },
  content: true,
  createdAt: true,
  id: true,
  name: true,
  updatedAt: true
})

const dbGet = async () => {
  return await prisma.clashTemplate.findMany({
    orderBy: { createdAt: 'desc' },
    select
  })
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
  return await prisma.clashTemplate.create({ data, select })
}

export type POST = RouteHandlerType<{
  body: Prisma.ClashTemplateCreateInput
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

const dbPut = async (id: string, data: PUT['body']) => {
  return await prisma.clashTemplate.update({
    data,
    select,
    where: { id }
  })
}

export type PUT = RouteHandlerType<{
  body: Pick<Prisma.ClashTemplateUpdateInput, 'content' | 'name'>
  return: Prisma.PromiseReturnType<typeof dbPut>
  search: {
    id: string
  }
}>

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

const dbDelete = async (id: string) => {
  return await prisma.clashTemplate.delete({ select, where: { id } })
}

export type DELETE = RouteHandlerType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
  search: {
    id: string
  }
}>

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
