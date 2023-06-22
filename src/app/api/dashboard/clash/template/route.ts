import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const select = {
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
} satisfies Prisma.ClashTemplateSelect

const dbGet = async () => {
  return prisma.clashTemplate.findMany({
    orderBy: { createdAt: 'desc' },
    select
  })
}

export type GET = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbGet>>
}>

export const GET = async () => {
  try {
    const res = await dbGet()
    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbPost = async (data: POST['body']) => {
  return prisma.clashTemplate.create({ data, select })
}

export type POST = RouteHandlerType<{
  body: Prisma.ClashTemplateCreateInput
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

const dbPut = async (id: string, data: PUT['body']) => {
  return prisma.clashTemplate.update({
    data,
    select,
    where: { id }
  })
}

export type PUT = RouteHandlerType<{
  body: Pick<Prisma.ClashTemplateUpdateInput, 'content' | 'name'>
  return: Awaited<ReturnType<typeof dbPut>>
  search: {
    id: string
  }
}>

export const PUT = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const data = await request.json()
    const res = await dbPut(id, data)

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbDelete = async (id: string) => {
  return prisma.clashTemplate.delete({ select, where: { id } })
}

export type DELETE = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbGet>>
  search: {
    id: string
  }
}>

export const DELETE = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const res = await dbDelete(id)

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
