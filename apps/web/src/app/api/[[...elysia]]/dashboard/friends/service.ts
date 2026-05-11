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
