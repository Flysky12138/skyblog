import { ActivityType, Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export abstract class Service {
  /**
   * 获取 Clash 详情
   */
  static async detail(id: string, data: Prisma.ActivityLogCreateInput) {
    return prisma.clash.update({
      data: {
        activityLogs: {
          create: {
            ...data,
            activityType: ActivityType.CLASH
          }
        }
      },
      include: {
        activityLogs: true,
        template: true
      },
      where: {
        id,
        isEnabled: true
      }
    })
  }
}
