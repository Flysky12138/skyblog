import { status } from 'elysia'
import { revalidateTag } from 'next/cache'

import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

import { FriendCreateBodyType, FriendUpdateBodyType } from './model'

export abstract class Service {
  /**
   * 创建友链
   */
  static async create(data: FriendCreateBodyType) {
    const res = await prisma.friend.create({ data })

    revalidateTag(CACHE_TAG.FRIENDS, 'max')

    return res
  }

  /**
   * 删除友链
   */
  static async delete(id: string) {
    const res = await prisma.friend.delete({
      where: { id }
    })

    revalidateTag(CACHE_TAG.FRIEND(id), 'max')
    revalidateTag(CACHE_TAG.FRIENDS, 'max')

    return res
  }

  /**
   * 生成友链封面
   *
   * @description 未完成，需修改
   */
  static async generateCover(id: string) {
    const friend = await prisma.friend.findUnique({ where: { id } })

    if (!friend) {
      return status(404)
    }

    const res = await fetch(`https://production-sfo.browserless.io/edge/screenshot?token=${process.env.TOKEN_BROWSERLESS}`, {
      method: 'POST',
      body: JSON.stringify({
        url: friend.siteUrl,
        options: {
          type: 'webp'
        },
        viewport: {
          deviceScaleFactor: 2,
          height: 900,
          isMobile: false,
          width: 1600
        }
      }),
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    })

    return res.arrayBuffer()
  }

  /**
   * 获取友链列表
   */
  static async list() {
    return prisma.friend.findMany()
  }

  /**
   * 更新友链
   */
  static async update(id: string, data: FriendUpdateBodyType) {
    const res = await prisma.friend.update({
      data,
      where: { id }
    })

    revalidateTag(CACHE_TAG.FRIEND(id), 'max')
    revalidateTag(CACHE_TAG.FRIENDS, 'max')

    return res
  }
}
