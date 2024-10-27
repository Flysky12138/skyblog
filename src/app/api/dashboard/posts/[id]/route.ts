import { CacheClear } from '@/lib/cache'
import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Category, Post, Prisma, Tag } from '@prisma/client'
import { NextRequest } from 'next/server'
import { include } from '../prisma.config'

const dbGet = async (id: string) => {
  return await prisma.post.findUnique({
    include,
    where: { id }
  })
}

export type GET = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
}>

export const GET = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbGet(params.id)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbPost = async (data: POST['body']) => {
  return await prisma.post.create({
    include,
    data: {
      author: {
        connect: {
          id: data.authorId
        }
      },
      categories: {
        connectOrCreate: data.categories.map(name => ({
          create: { name },
          where: { name }
        }))
      },
      content: data.content,
      description: data.description,
      showTitleCard: data.showTitleCard,
      sticky: data.sticky,
      tags: {
        connectOrCreate: data.tags.map(name => ({
          create: { name },
          where: { name }
        }))
      },
      title: data.title
    }
  })
}

export type POST = MethodRouteType<{
  body: Pick<Post, 'title' | 'description' | 'content' | 'authorId' | 'sticky' | 'showTitleCard'> & {
    categories: Category['name'][]
    tags: Tag['name'][]
  }
  return: Prisma.PromiseReturnType<typeof dbPost>
}>

export const POST = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (params.id != 'new') return CustomResponse.error("{id} 值不为 'new'", 422)

    const data = await request.json()
    const res = await dbPost(data)
    CacheClear.post(res.id)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbPut = async (id: string, data: PUT['body']) => {
  await prisma.post.update({
    data: {
      categories: { set: [] },
      tags: { set: [] }
    },
    where: { id }
  })

  return await prisma.post.update({
    include,
    data: {
      categories: {
        connectOrCreate: data.categories.map(name => ({
          create: { name },
          where: { name }
        }))
      },
      content: data.content,
      description: data.description,
      showTitleCard: data.showTitleCard,
      sticky: data.sticky,
      tags: {
        connectOrCreate: data.tags.map(name => ({
          create: { name },
          where: { name }
        }))
      },
      title: data.title,
      updatedAt: new Date().toISOString()
    },
    where: { id }
  })
}

export type PUT = MethodRouteType<{
  body: Omit<POST['body'], 'authorId'>
  return: Prisma.PromiseReturnType<typeof dbPut>
}>

export const PUT = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await request.json()
    const res = await dbPut(params.id, data)
    CacheClear.post(params.id)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbPatch = async (id: string, data: PATCH['body']) => {
  return await prisma.post.update({
    data,
    include,
    where: { id }
  })
}

export type PATCH = MethodRouteType<{
  body: Pick<Post, 'published'>
  return: Prisma.PromiseReturnType<typeof dbPatch>
}>

export const PATCH = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await request.json()
    const res = await dbPatch(params.id, data)
    CacheClear.post(params.id)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbDelete = async (id: string) => {
  return await prisma.post.delete({
    where: { id }
  })
}

export type DELETE = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbDelete>
}>

export const DELETE = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbDelete(params.id)
    CacheClear.post(params.id)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
