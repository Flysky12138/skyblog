import { getDirectoryTreeIds } from '@/generated/prisma/sql'
import { prisma } from '@/lib/prisma'

export abstract class Service {
  /**
   * 删除目录（批量优化版）
   *
   * 一次性查出所有后代目录 ID，按深度从最深到最浅逐层批量删除，
   * 将原先的 N 次递归查询 + N 次删除 降为 1 次查询 + 少数几次批量删除。
   */
  static async delete(id: string) {
    const rows = await prisma.$queryRawTyped(getDirectoryTreeIds(id))

    const byDepth = new Map<number, string[]>()
    for (const { depth, id } of rows) {
      if (!depth || !id) continue
      if (!byDepth.has(depth)) {
        byDepth.set(depth, [])
      }
      byDepth.get(depth)?.push(id)
    }

    // 从最深到最浅逐层删除，避免 Restrict 约束
    const depths = [...byDepth.keys()].sort((a, b) => b - a)
    await prisma.$transaction(async ctx => {
      for (const depth of depths) {
        const ids = byDepth.get(depth)!
        await ctx.directory.deleteMany({
          where: {
            id: {
              in: ids
            }
          }
        })
      }
    })
  }

  /**
   * 获取目录列表
   */
  static async list(id: string) {
    const [directories, files, parentDirectory] = await Promise.all([
      prisma.directory.findMany({
        orderBy: [{ createdAt: 'asc' }, { name: 'asc' }],
        where: {
          parentId: id,
          id: {
            not: id
          }
        }
      }),
      prisma.file.findMany({
        include: { s3Object: true },
        orderBy: [{ createdAt: 'asc' }, { name: 'asc' }],
        where: { directoryId: id }
      }),
      prisma.directory.findUniqueOrThrow({ where: { id } }).then(directory => ({
        ...directory,
        isRoot: directory.parentId === id
      }))
    ])

    return { directories, files, parentDirectory }
  }
}
