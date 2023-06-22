import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'
import { convertVariable, parseVariable } from './lib'

export type GET = MethodRequestType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
}>
export type POST = MethodRequestType<{
  body: Omit<Prisma.ClashUncheckedCreateInput, 'variables'> & {
    variables: object
  }
  return: Prisma.PromiseReturnType<typeof dbPost>
}>
export type PUT = MethodRequestType<{
  body: Pick<Prisma.ClashUncheckedCreateInput, 'name' | 'subtitle' | 'content' | 'clashTemplateId'> & {
    variables: object
  }
  return: Prisma.PromiseReturnType<typeof dbPut>
  search: {
    id: string
  }
}>
export type DELETE = MethodRequestType<{
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

const dbPost = async (data: POST['body']) => {
  return parseVariable(
    await prisma.clash.create({
      include,
      data: convertVariable(data)
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
  return parseVariable(
    await prisma.clash.update({
      include,
      data: {
        ...convertVariable(data),
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
