import { prisma } from '@/lib/prisma'

import { VisitCreateBodyType } from './model'

export abstract class Service {
  /**
   * 创建访问记录
   */
  static async create(data: VisitCreateBodyType) {
    return prisma.activityLog.create({ data })
  }
}
