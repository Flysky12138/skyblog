import { prisma } from '@/lib/prisma'

export abstract class Service {
  static async detail(id: string) {
    /**
     * 获取文章详情
     */
    return prisma.post.findUnique({
      where: { id },
      select: {
        commentCount: true,
        createdAt: true,
        isPublished: true,
        updatedAt: true,
        viewCount: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    })
  }

  /**
   * 更新文章
   */
  static async update(id: string) {
    return prisma.post.update({
      data: {
        viewCount: {
          increment: 1
        }
      },
      where: {
        id,
        isPublished: true
      }
    })
  }
}
