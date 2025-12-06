import { internal } from '@/lib/prisma'

export abstract class Service {
  /**
   * 获取成员列表
   */
  static async list() {
    return internal.user.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
  }
}
