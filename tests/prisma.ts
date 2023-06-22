import prisma from '@/lib/prisma'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const main = async () => {
  const posts = await prisma.visitorLog.deleteMany({
    where: {
      ip: {
        startsWith: '104'
      }
    }
  })
  console.log(posts)
}

main()
