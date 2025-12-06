import fs from 'node:fs'

import { prisma } from '@/lib/prisma'

const main = async () => {
  const data = fs.readFileSync(new URL('./post.json', import.meta.url), 'utf-8')
  const json = JSON.parse(data)

  await prisma.post.createMany({
    data: json
  })
}

main()
