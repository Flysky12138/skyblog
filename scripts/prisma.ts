import prisma from '@/lib/prisma'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

void (async () => {
  await prisma.tag.deleteMany({
    where: {
      posts: {
        none: {}
      }
    }
  })
})()
