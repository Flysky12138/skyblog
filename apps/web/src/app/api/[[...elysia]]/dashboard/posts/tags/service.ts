import { prisma } from '@/lib/prisma'

import { TagCreateBodyType, TagUpdateBodyType } from './model'

export abstract class Service {
  /**
   * 创建分类模板
   */
  static async create(data: TagCreateBodyType) {
    return prisma.tag.create({ data })
  }

  /**
   * 删除分类模板
   */
  static async delete(id: string) {
    return prisma.tag.delete({ where: { id } })
  }

  /**
   * 获取分类模板列表
   */
  static async list() {
    return prisma.tag.findMany()
  }

  /**
   * 更新分类模板
   */
  static async update(id: string, data: TagUpdateBodyType) {
    return prisma.tag.update({ data, where: { id } })
  }
}
