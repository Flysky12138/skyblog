import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

const include = Prisma.validator<Prisma.ClashInclude>()({
  visitorInfos: {
    orderBy: {
      createdAt: 'desc'
    }
  }
})

const dbGet = async () => {
  return await prisma.clash.findMany({
    include,
    orderBy: { createdAt: 'desc' }
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
  return await prisma.clash.create({ data, include })
}

export type POST = RouteHandlerType<{
  body: Omit<Prisma.ClashUncheckedCreateInput, 'variables'> & {
    variables: Record<string, string | null | undefined>
  }
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
  return await prisma.clash.update({
    include,
    data: {
      ...data,
      updatedAt: new Date().toISOString()
    },
    where: { id }
  })
}

export type PUT = RouteHandlerType<{
  body: Pick<Prisma.ClashUncheckedCreateInput, 'name' | 'subtitle' | 'content' | 'clashTemplateId'> & {
    variables: object
  }
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

const dbPatch = async (id: string, data: PATCH['body']) => {
  return await prisma.clash.update({
    data,
    include,
    where: { id }
  })
}

export type PATCH = RouteHandlerType<{
  body: Pick<Prisma.ClashUncheckedCreateInput, 'enabled'>
  return: Prisma.PromiseReturnType<typeof dbPatch>
  search: {
    id: string
  }
}>

export const PATCH = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await request.json()
    const res = await dbPatch(id, data)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbDelete = async (id: string) => {
  return await prisma.clash.delete({ include, where: { id } })
}

export type DELETE = RouteHandlerType<{
  return: Prisma.PromiseReturnType<typeof dbDelete>
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
