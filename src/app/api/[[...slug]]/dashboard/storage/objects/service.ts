import { prisma } from '@/lib/prisma'

export abstract class Service {
  /**
   * 获取对象详情
   */
  static async detail(id: string) {
    return prisma.s3Object.findUnique({
      where: { id }
    })
  }
}
