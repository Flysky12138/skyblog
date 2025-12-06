import fs from 'node:fs/promises'

import { prisma } from '@/lib/prisma'

const BACKUP_DIR = new URL('./backups/', import.meta.url)

await Promise.allSettled([
  await prisma.category.createMany({ data: JSON.parse(await fs.readFile(new URL('categories.json', BACKUP_DIR), { encoding: 'utf-8' })) }),
  await prisma.tag.createMany({ data: JSON.parse(await fs.readFile(new URL('tags.json', BACKUP_DIR), { encoding: 'utf-8' })) }),
  await prisma.post.createMany({ data: JSON.parse(await fs.readFile(new URL('posts.json', BACKUP_DIR), { encoding: 'utf-8' })) }),
  await prisma.clashTemplate.createMany({ data: JSON.parse(await fs.readFile(new URL('clash-templates.json', BACKUP_DIR), { encoding: 'utf-8' })) }),
  await prisma.clash.createMany({ data: JSON.parse(await fs.readFile(new URL('clashes.json', BACKUP_DIR), { encoding: 'utf-8' })) })
])
