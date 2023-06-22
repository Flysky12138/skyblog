import { CacheClear } from '@/lib/cache'
import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Category, Post, Prisma, Tag } from '@prisma/client'
import { NextRequest } from 'next/server'
import { include } from '../prisma.config'

// 获取
const dbGet = async (id: string) => {
  return await prisma.post.findUnique({
    include,
    where: { id }
  })
}

export const GET = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbGet(params.id)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

// 创建
export interface PostDetailPostRequest extends Pick<Post, 'title' | 'description' | 'content' | 'authorId' | 'sticky' | 'showTitleCard'> {
  categories: Category['name'][]
  tags: Tag['name'][]
}

const dbPost = async (data: PostDetailPostRequest) => {
  return await prisma.post.create({
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
    },
    include
  })
}

export const POST = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (params.id != 'new') return CustomResponse.error("{id} 值不为 'new'", 422)

    const data = await request.json()
    const res = await dbPost(data)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

// 修改
export interface PostDetailPutRequest extends Omit<PostDetailPostRequest, 'authorId'> {}

const dbPut = async (id: string, data: PostDetailPutRequest) => {
  await prisma.post.update({
    data: {
      categories: { set: [] },
      tags: { set: [] }
    },
    where: { id }
  })

  return await prisma.post.update({
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
    include,
    where: { id }
  })
}

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

// 修改部分
export interface PostDetailPatchRequest extends Pick<Post, 'published'> {}

const dbPatch = async (id: string, data: PostDetailPatchRequest) => {
  return await prisma.post.update({
    data,
    include,
    where: { id }
  })
}

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

// 删除
const dbDelete = async (id: string) => {
  return await prisma.post.delete({
    where: { id }
  })
}

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

export type PostDetailGetResponseType = Prisma.PromiseReturnType<typeof dbGet>
export type PostDetailPostResponseType = Prisma.PromiseReturnType<typeof dbPost>
export type PostDetailPutResponseType = Prisma.PromiseReturnType<typeof dbPut>
export type PostDetailPatchResponseType = Prisma.PromiseReturnType<typeof dbPatch>
export type PostDetailDeleteResponseType = Prisma.PromiseReturnType<typeof dbDelete>
