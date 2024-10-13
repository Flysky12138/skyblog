import prisma from '@/lib/prisma'
import { R2 } from '@/lib/server/r2'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { getImageSize } from 'next/dist/server/image-optimizer'
import { NextRequest } from 'next/server'
import puppeteer, { Browser } from 'puppeteer-core'

export type PUT = MethodRouteType<{
  body: Prisma.FriendLinksCreateInput
  return: Prisma.PromiseReturnType<typeof dbPut>
}>
export type PATCH = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbPatch>
}>
export type DELETE = MethodRouteType<{
  return: Prisma.PromiseReturnType<typeof dbDelete>
}>

const dbPut = async (id: string, data: PUT['body']) => {
  return await prisma.friendLinks.update({
    data: {
      updatedAt: new Date().toISOString(),
      ...data
    },
    where: { id }
  })
}

export const PUT = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const data = await request.json()
    const res = await dbPut(params.id, data)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

const dbPatch = async (id: string, data: Prisma.FriendLinksUpdateInput) => {
  return await prisma.friendLinks.update({
    data: {
      updatedAt: new Date().toISOString(),
      ...data
    },
    where: { id }
  })
}

export const PATCH = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  let browser: Browser | null = null
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const friendLink = await prisma.friendLinks.findUnique({ where: { id: params.id } })
    if (!friendLink) return CustomResponse.error('未找到资源', 404)

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.TOKEN_BROWSERLESS}`,
      defaultViewport: { height: 900, width: 1600 },
      slowMo: 100
    })
    const page = await browser.newPage()
    await page.goto(friendLink.url)
    const buffer = await page.screenshot({ type: 'webp' })

    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    const key = `friend-links/${params.id}.webp`
    const metadata = await getImageSize(buffer, 'webp')

    // 保存封面
    await R2.put({ blob, key, metadata })

    // 保存封面直链
    const res = await dbPatch(params.id, { cover: R2.get(key) })

    return CustomResponse.encrypt(res)
  } catch (error) {
    console.log(error)
    return CustomResponse.error(error)
  } finally {
    browser?.close()
  }
}

const dbDelete = async (id: string) => {
  return await prisma.friendLinks.delete({
    where: { id }
  })
}

export const DELETE = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    // 删除封面
    await R2.delete(`friend-links/${params.id}.webp`)

    const res = await dbDelete(params.id)

    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
