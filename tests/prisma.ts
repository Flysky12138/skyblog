import prisma from '@/lib/prisma'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const main = async () => {
  const posts = await prisma.visitorLog.deleteMany()
  console.log(posts)
}

main()
