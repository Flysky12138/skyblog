import fs from 'node:fs/promises'

import {
  CategoryCreateManyInput,
  ClashCreateManyInput,
  ClashTemplateCreateManyInput,
  PostCreateManyInput,
  TagCreateManyInput
} from '@/generated/prisma/models'
import { prisma } from '@/lib/prisma'

const BACKUP_DIR = new URL('./backups/', import.meta.url)

async function readFileContent<T>(filePath: string) {
  const fileContent = await fs.readFile(new URL(filePath, BACKUP_DIR), { encoding: 'utf-8' })
  return JSON.parse(fileContent) as T
}

await Promise.allSettled([
  prisma.category.createMany({ data: await readFileContent<CategoryCreateManyInput>('categories.json') }),
  prisma.tag.createMany({ data: await readFileContent<TagCreateManyInput>('tags.json') }),
  prisma.post.createMany({ data: await readFileContent<PostCreateManyInput>('posts.json') }),
  prisma.clashTemplate.createMany({ data: await readFileContent<ClashTemplateCreateManyInput>('clash-templates.json') }),
  prisma.clash.createMany({ data: await readFileContent<ClashCreateManyInput>('clashes.json') })
])
