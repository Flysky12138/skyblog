import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

import { ClashTemplateCreateBodyType, ClashTemplateUpdateBodyType } from './model'

const select = {
  content: true,
  createdAt: true,
  id: true,
  name: true,
  updatedAt: true,
  _count: {
    select: {
      clashes: true
    }
  }
} satisfies Prisma.ClashTemplateSelect

export abstract class Service {
  /**
   * 创建 Clash 模板
   */
  static async create(data: ClashTemplateCreateBodyType) {
    return prisma.clashTemplate.create({ data, select })
  }

  /**
   * 删除 Clash 模板
   */
  static async delete(id: string) {
    return prisma.clashTemplate.delete({ select, where: { id } })
  }

  /**
   * 获取 Clash 模板列表
   */
  static async list() {
    return prisma.clashTemplate.findMany({
      orderBy: { createdAt: 'desc' },
      select
    })
  }

  /**
   * 更新 Clash 模板
   */
  static async update(id: string, data: ClashTemplateUpdateBodyType) {
    return prisma.clashTemplate.update({
      data,
      select,
      where: { id }
    })
  }
}
