import { prisma } from '@/lib/prisma'

export abstract class Service {
  static async detail(id: string) {
    /**
     * 获取文章详情
     */
    return prisma.post.findUnique({
      select: {
        content: true
      },
      where: {
        id,
        isPublished: false
      }
    })
  }
}
