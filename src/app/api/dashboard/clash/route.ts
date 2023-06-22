import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'
import { convertVisitorLogGetData } from '../users/visitor/utils'
import { convertClashGetData, convertClashSaveData } from './utils'

export type GET = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
}>
export type POST = MethodRouteType<{
  body: Omit<Prisma.ClashUncheckedCreateInput, 'variables'> & {
    variables: object
  }
  return: Prisma.PromiseReturnType<typeof dbPost>
}>
export type PUT = MethodRouteType<{
  body: Pick<Prisma.ClashUncheckedCreateInput, 'name' | 'subtitle' | 'content' | 'clashTemplateId'> & {
    variables: object
  }
  return: Prisma.PromiseReturnType<typeof dbPut>
  search: {
    id: string
  }
}>
export type PATCH = MethodRouteType<{
  body: Pick<Prisma.ClashUncheckedCreateInput, 'enabled'>
  return: Prisma.PromiseReturnType<typeof dbPatch>
  search: {
    id: string
  }
}>
export type DELETE = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbDelete>
  search: {
    id: string
  }
}>

const include = Prisma.validator<Prisma.ClashInclude>()({
  visitorInfos: {
    orderBy: {
      createdAt: 'desc'
    }
  }
})

const dbGet = async () => {
  const data = await prisma.clash.findMany({
    include,
    orderBy: { createdAt: 'desc' }
  })
  return data.map(({ visitorInfos, ...it }) =>
    convertClashGetData({
      ...it,
      visitorInfos: visitorInfos.map(convertVisitorLogGetData)
    })
  )
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
  return convertClashGetData(
    await prisma.clash.create({
      include,
      data: convertClashSaveData(data)
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

const dbPut = async (id: string, data: PUT['body']) => {
  return convertClashGetData(
    await prisma.clash.update({
      include,
      data: {
        ...convertClashSaveData(data),
        updatedAt: new Date().toISOString()
      },
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

const dbPatch = async (id: string, data: PATCH['body']) => {
  return await prisma.clash.update({
    data,
    include,
    where: { id }
  })
}

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
  return convertClashGetData(await prisma.clash.delete({ include, where: { id } }))
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
