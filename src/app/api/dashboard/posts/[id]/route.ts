import { Category, Post, Tag } from '@prisma/client'
import { NextRequest } from 'next/server'

import { CacheClear } from '@/lib/cache'
import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

import { include } from '../prisma.config'

const dbGet = async (id: string) => {
  return prisma.post.findUnique({
    include,
    where: { id }
  })
}

export type GET = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbGet>>
}>

export const GET = async (request: NextRequest, { params }: RouteContext<'/api/dashboard/posts/[id]'>) => {
  try {
    const { id } = await params

    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const res = await dbGet(id)

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbPost = async (data: POST['body']) => {
  return prisma.post.create({
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
      display: data.display,
      sticky: data.sticky,
      tags: {
        connectOrCreate: data.tags.map(name => ({
          create: { name },
          where: { name }
        }))
      },
      title: data.title
    },
    include
  })
}

export type POST = RouteHandlerType<{
  body: Pick<Post, 'authorId' | 'content' | 'description' | 'display' | 'published' | 'sticky' | 'title'> & {
    categories: Category['name'][]
    tags: Tag['name'][]
  }
  return: Awaited<ReturnType<typeof dbPost>>
}>

export const POST = async (request: NextRequest, { params }: RouteContext<'/api/dashboard/posts/[id]'>) => {
  try {
    const { id } = await params

    if (id != 'new') return await CustomResponse.error("{id} 值不为 'new'", { status: 400 })

    const data = await request.json()
    const res = await dbPost(data)

    CacheClear.post(res.id)

    return await CustomResponse.encrypt(res)
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
  return prisma.post.update({
    data: {
      categories: {
        connectOrCreate: data.categories.map(name => ({
          create: { name },
          where: { name }
        }))
      },
      content: data.content,
      description: data.description,
      display: data.display,
      published: data.published,
      sticky: data.sticky,
      tags: {
        connectOrCreate: data.tags.map(name => ({
          create: { name },
          where: { name }
        }))
      },
      title: data.title,
      updatedAt: data.updatedAt
    },
    include,
    where: { id }
  })
}

export type PUT = RouteHandlerType<{
  body: Omit<POST['body'], 'authorId'> & Partial<Pick<Post, 'updatedAt'>>
  return: Awaited<ReturnType<typeof dbPut>>
}>

export const PUT = async (request: NextRequest, { params }: RouteContext<'/api/dashboard/posts/[id]'>) => {
  try {
    const { id } = await params

    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const data = await request.json()
    const res = await dbPut(id, data)

    CacheClear.post(id)

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbPatch = async (id: string, data: PATCH['body']) => {
  return prisma.post.update({
    data,
    include,
    where: { id }
  })
}

export type PATCH = RouteHandlerType<{
  body: Pick<Post, 'published'>
  return: Awaited<ReturnType<typeof dbPatch>>
}>

export const PATCH = async (request: NextRequest, { params }: RouteContext<'/api/dashboard/posts/[id]'>) => {
  try {
    const { id } = await params

    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const data = await request.json()
    const res = await dbPatch(id, data)

    CacheClear.post(id)

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbDelete = async (id: string) => {
  return prisma.post.delete({
    where: { id }
  })
}

export type DELETE = RouteHandlerType<{
  return: Awaited<ReturnType<typeof dbDelete>>
}>

export const DELETE = async (request: NextRequest, { params }: RouteContext<'/api/dashboard/posts/[id]'>) => {
  try {
    const { id } = await params

    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const res = await dbDelete(id)

    CacheClear.post(id)

    return await CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
