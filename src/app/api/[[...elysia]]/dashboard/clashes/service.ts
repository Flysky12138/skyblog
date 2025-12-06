import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

import { ClashCreateBodyType, ClashUpdateBodyType } from './model'

const include = {
  activityLogs: {
    orderBy: {
      createdAt: 'desc'
    }
  }
} satisfies Prisma.ClashInclude

export abstract class Service {
  /**
   * 创建 Clash
   */
  static async create(data: ClashCreateBodyType) {
    return prisma.clash.create({ data, include })
  }

  /**
   * 删除 Clash
   */
  static async delete(id: string) {
    return prisma.clash.delete({ include, where: { id } })
  }

  /**
   * 获取 Clash 列表
   */
  static async list() {
    return prisma.clash.findMany({
      include,
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * 更新 Clash
   */
  static async update(id: string, data: ClashUpdateBodyType) {
    return prisma.clash.update({
      data,
      include,
      where: { id }
    })
  }
}
