'use cache'

import { MetadataRoute } from 'next'
import { cacheLife, cacheTag } from 'next/cache'

import { CacheTag } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  cacheLife('max')
  cacheTag(CacheTag.FRIENDS)

  const friends = await prisma.friend.findMany({
    select: { updatedAt: true, url: true }
  })

  return friends.map(friend => ({
    changeFrequency: 'weekly',
    lastModified: friend.updatedAt,
    priority: 0.5,
    url: friend.url
  }))
}
