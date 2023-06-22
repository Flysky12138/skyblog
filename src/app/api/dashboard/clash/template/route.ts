import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

export type GET = MethodRequestType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
}>
export type POST = MethodRequestType<{
  body: Prisma.ClashTemplateCreateInput
  return: Prisma.PromiseReturnType<typeof dbPost>
}>
export type PUT = MethodRequestType<{
  body: Pick<Prisma.ClashTemplateUpdateInput, 'name' | 'content'>
  return: Prisma.PromiseReturnType<typeof dbPut>
  search: {
    id: number
  }
}>
export type DELETE = MethodRequestType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
  search: {
    id: number
  }
}>

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

const dbPost = async (data: POST['body']) => {
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

const dbPut = async (id: number, data: PUT['body']) => {
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
