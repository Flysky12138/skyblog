import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { del, put } from '@vercel/blob'
import { NextRequest } from 'next/server'
import puppeteer, { Browser } from 'puppeteer-core'

// 修改
export interface FriendLinksPutRequestType extends Prisma.FriendLinksCreateInput {}

const dbPut = async (id: number, data: FriendLinksPutRequestType) => {
  return await prisma.friendLinks.update({
    data: {
      updatedAt: new Date().toISOString(),
      ...data
    },
    where: { id }
  })
}

export const PUT = async (request: NextRequest, { params }: DynamicRouteType<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await request.json()
    const res = await dbPut(Number.parseInt(params.id), data)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

// 修改部分
const dbPatch = async (id: number, data: Prisma.FriendLinksUpdateInput) => {
  return await prisma.friendLinks.update({
    data: {
      updatedAt: new Date().toISOString(),
      ...data
    },
    where: { id }
  })
}

export const PATCH = async (request: NextRequest, { params }: DynamicRouteType<{ id: string }>) => {
  let browser: Browser | null = null
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const friendLink = await prisma.friendLinks.findUnique({ where: { id: Number.parseInt(params.id) } })
    if (!friendLink) return CustomResponse.error('未找到资源', 404)

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.TOKEN_BROWSERLESS}`,
      defaultViewport: { height: 900, width: 1600 },
      slowMo: 100
    })
    const page = await browser.newPage()
    await page.goto(friendLink.url)
    const blob = await page.screenshot({ type: 'webp' })

    const oldCover = await prisma.friendLinks.findUnique({
      select: { cover: true },
      where: { id: Number.parseInt(params.id) }
    })
    const { url: cover } = await put(`friend-links/${params.id}.webp`, blob, { access: 'public' })
    if (oldCover && oldCover.cover) del(oldCover.cover)

    const res = await dbPatch(Number.parseInt(params.id), {
      cover
    })

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  } finally {
    browser?.close()
  }
}

// 删除
const dbDelete = async (id: number) => {
  return await prisma.friendLinks.delete({
    where: { id }
  })
}

export const DELETE = async (request: NextRequest, { params }: DynamicRouteType<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const res = await dbDelete(Number.parseInt(params.id))

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type FriendLinksPutResponseType = Prisma.PromiseReturnType<typeof dbPut>
export type FriendLinksPatchResponseType = Prisma.PromiseReturnType<typeof dbPatch>
export type FriendLinksDeleteResponseType = Prisma.PromiseReturnType<typeof dbDelete>
