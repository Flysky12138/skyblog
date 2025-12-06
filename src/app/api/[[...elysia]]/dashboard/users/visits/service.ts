import { prisma } from '@/lib/prisma'

import { PaginationQueryType } from '../../../model'
import { VisitDeleteBodyType } from './model'

export abstract class Service {
  /**
   * 删除访客
   */
  static async delete({ ids }: VisitDeleteBodyType) {
    return prisma.activityLog.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
  }

  /**
   * 获取访客列表
   */
  static async list({ limit = 10, page = 1 }: PaginationQueryType) {
    const [visits, pagination] = await prisma.activityLog
      .paginate({
        include: {
          clash: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      .withPages({ limit, page })

    return {
      pagination,
      visits
    }
  }
}
