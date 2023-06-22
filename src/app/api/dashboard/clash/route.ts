import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

const include = {
  visitorInfos: {
    orderBy: {
      createdAt: 'desc'
    }
  }
} satisfies Prisma.ClashInclude

const dbGet = async () => {
  return prisma.clash.findMany({
    include,
    orderBy: { createdAt: 'desc' }
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
  return prisma.clash.create({ data, include })
}

export type POST = RouteHandlerType<{
  body: Omit<Prisma.ClashUncheckedCreateInput, 'variables'> & {
    variables: Record<string, null | string | undefined>
  }
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
  return prisma.clash.update({
    data: {
      ...data,
      updatedAt: new Date().toISOString()
    },
    include,
    where: { id }
  })
}

export type PUT = RouteHandlerType<{
  body: Pick<Prisma.ClashUncheckedCreateInput, 'clashTemplateId' | 'content' | 'name' | 'subtitle'> & {
    variables: object
  }
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

const dbPatch = async (id: string, data: PATCH['body']) => {
  return prisma.clash.update({
    data,
    include,
    where: { id }
  })
}

export type PATCH = RouteHandlerType<{
  body: Pick<Prisma.ClashUncheckedCreateInput, 'enabled'>
  return: Awaited<ReturnType<typeof dbPatch>>
  search: {
    id: string
  }
}>

export const PATCH = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const data = await request.json()
    const res = await dbPatch(id, data)

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbDelete = async (id: string) => {
  return prisma.clash.delete({ include, where: { id } })
}

export type DELETE = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbDelete>>
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
