import { STORAGE } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

async function main() {
  await prisma.directory.upsert({
    create: {
      id: STORAGE.ROOT_DIRECTORY_ID,
      name: '/',
      parentId: STORAGE.ROOT_DIRECTORY_ID
    },
    update: {},
    where: { id: STORAGE.ROOT_DIRECTORY_ID }
  })
}

main().finally(() => prisma.$disconnect())
