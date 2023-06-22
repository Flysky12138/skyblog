import { prisma } from '@/lib/prisma'

export abstract class Service {
  /**
   * 删除目录
   */
  static async delete(id: string) {
    const children = await prisma.directory.findMany({
      select: { id: true },
      where: { parentId: id }
    })

    for (const child of children) {
      await Service.delete(child.id)
    }

    await prisma.directory.delete({
      where: { id }
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
        isRoot: directory.parentId == id
      }))
    ])

    return { directories, files, parentDirectory }
  }
}
