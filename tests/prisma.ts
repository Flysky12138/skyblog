import dotenv from 'dotenv'

import { prisma } from '@/lib/prisma'

dotenv.config({ path: '.env.local' })

const main = async () => {
  const posts = await prisma.visitorLog.deleteMany()
  console.log(posts)
}

main()
