import fs from 'node:fs/promises'

import { prisma } from '@/lib/prisma'

const BACKUP_DIR = new URL('./backups/', import.meta.url)

await fs.mkdir(BACKUP_DIR, { recursive: true })

await Promise.allSettled([
  fs.writeFile(new URL('posts.json', BACKUP_DIR), JSON.stringify(await prisma.post.findMany(), null, 2)),
  fs.writeFile(new URL('tags.json', BACKUP_DIR), JSON.stringify(await prisma.tag.findMany(), null, 2)),
  fs.writeFile(new URL('categories.json', BACKUP_DIR), JSON.stringify(await prisma.category.findMany(), null, 2)),
  fs.writeFile(new URL('clashes.json', BACKUP_DIR), JSON.stringify(await prisma.clash.findMany(), null, 2)),
  fs.writeFile(new URL('clash-templates.json', BACKUP_DIR), JSON.stringify(await prisma.clashTemplate.findMany(), null, 2))
])
