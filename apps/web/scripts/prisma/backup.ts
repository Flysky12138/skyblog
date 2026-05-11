import fs from 'node:fs/promises'

import { prisma } from '@/lib/prisma'

const BACKUP_DIR = new URL('./backups/', import.meta.url)

await fs.mkdir(BACKUP_DIR, { recursive: true })

const writeFileContent = async (filePath: string, content: object) => {
  await fs.writeFile(new URL(filePath, BACKUP_DIR), JSON.stringify(content, null, 2))
}

await Promise.allSettled([
  writeFileContent('posts.json', await prisma.post.findMany()),
  writeFileContent('tags.json', await prisma.tag.findMany()),
  writeFileContent('categories.json', await prisma.category.findMany()),
  writeFileContent('clashes.json', await prisma.clash.findMany()),
  writeFileContent('clash-templates.json', await prisma.clashTemplate.findMany())
])
