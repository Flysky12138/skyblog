import { revalidateTag } from 'next/cache'

import { Prisma } from '@/generated/prisma/client'
import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

import { Service as _Service } from '../storage/files/service'
import { FriendCoverBodyType, FriendCreateBodyType, FriendUpdateBodyType } from './model'

const include = {
  screenshotFile: true
} satisfies Prisma.FriendInclude

export abstract class Service {
  /**
   * 创建友链
   */
  static async create(data: FriendCreateBodyType) {
    const res = await prisma.friend.create({
      data,
      include
    })

    revalidateTag(CACHE_TAG.FRIENDS, 'max')

    return res
  }

  /**
   * 删除友链
   */
  static async delete(id: string) {
    const res = await prisma.friend.delete({
      include,
      where: { id }
    })

    if (res.screenshotFileId) {
      await _Service.delete(res.screenshotFileId)
    }

    revalidateTag(CACHE_TAG.FRIEND(id), 'max')
    revalidateTag(CACHE_TAG.FRIENDS, 'max')

    return res
  }

  /**
   * 生成友链封面
   *
   * @description 将截图二进制数据转为 base64 返回，便于 JSON 序列化和前端使用
   */
  static async generateCover({ url }: FriendCoverBodyType) {
    const [width, height] = [1600, 900]

    const res = await fetch(`https://production-sfo.browserless.io/edge/screenshot?token=${process.env.TOKEN_BROWSERLESS}`, {
      method: 'POST',
      body: JSON.stringify({
        url,
        gotoOptions: {
          waitUntil: 'networkidle2'
        },
        options: {
          type: 'webp'
        },
        viewport: {
          deviceScaleFactor: 2,
          height,
          isMobile: false,
          width
        }
      }),
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    })

    const arrayBuffer = await res.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    return {
      data: `data:image/webp;base64,${base64}`,
      ext: 'webp',
      height,
      siteUrl: url,
      width
    }
  }

  /**
   * 获取友链列表
   */
  static async list() {
    return prisma.friend.findMany({ include })
  }

  /**
   * 更新友链
   */
  static async update(id: string, data: FriendUpdateBodyType) {
    const res = await prisma.friend.update({
      data,
      include,
      where: { id }
    })

    revalidateTag(CACHE_TAG.FRIEND(id), 'max')
    revalidateTag(CACHE_TAG.FRIENDS, 'max')

    return res
  }
}
