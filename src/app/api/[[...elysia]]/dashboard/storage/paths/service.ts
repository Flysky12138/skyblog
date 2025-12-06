import { prisma } from '@/lib/prisma'

export abstract class Service {
  /**
   * 获取目录位置详情
   */
  static async detail(id: string) {
    return prisma.$queryRaw<{ depth: number; id: string; name: string }[]>`
      WITH RECURSIVE dir_path AS (
        SELECT id, name, parent_id, 0 AS depth
        FROM directories
        WHERE id = ${id}
      
        UNION ALL
      
        SELECT d.id, d.name, d.parent_id, dp.depth + 1
        FROM directories d
        JOIN dir_path dp ON dp.parent_id = d.id
        WHERE dp.parent_id <> dp.id
      )
      SELECT id, name, depth
      FROM dir_path
      ORDER BY depth DESC
      `
  }
}
