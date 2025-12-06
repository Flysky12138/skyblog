import { prisma } from '@/lib/prisma'

import { CategoryCreateBodyType, CategoryUpdateBodyType } from './model'

export abstract class Service {
  /**
   * 创建分类模板
   */
  static async create(data: CategoryCreateBodyType) {
    return prisma.category.create({ data })
  }

  /**
   * 删除分类模板
   */
  static async delete(id: string) {
    return prisma.category.delete({ where: { id } })
  }

  /**
   * 获取分类模板列表
   */
  static async list() {
    return prisma.category.findMany()
  }

  /**
   * 更新分类模板
   */
  static async update(id: string, data: CategoryUpdateBodyType) {
    return prisma.category.update({ data, where: { id } })
  }
}
