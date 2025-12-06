import { prisma } from '@/lib/prisma'

export abstract class Service {
  /**
   * 获取目录列表
   */
  static async list(id: string) {
    const [directories, files, parentDirectory] = await Promise.all([
      prisma.directory.findMany({
        orderBy: [{ createdAt: 'asc' }, { name: 'asc' }],
        where: {
          id: {
            not: id
          },
          parentId: id
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
