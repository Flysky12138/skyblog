import { STORAGE } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

const main = async () => {
  // 创建根目录
  await prisma.directory.upsert({
    update: {},
    where: { id: STORAGE.ROOT_DIRECTORY_ID },
    create: {
      id: STORAGE.ROOT_DIRECTORY_ID,
      name: '/',
      parentId: STORAGE.ROOT_DIRECTORY_ID
    }
  })
}

main().finally(() => prisma.$disconnect())
