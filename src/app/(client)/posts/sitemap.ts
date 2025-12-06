import { MetadataRoute } from 'next'

import { prisma } from '@/lib/prisma'

import { POST_WHERE_INPUT } from '../utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    select: { id: true, updatedAt: true },
    where: POST_WHERE_INPUT
  })

  return posts.map(post => ({
    changeFrequency: 'daily',
    lastModified: post.updatedAt,
    priority: 0.8,
    url: new URL(`/posts/${post.id}`, process.env.NEXT_PUBLIC_WEBSITE_URL).href
  }))
}
