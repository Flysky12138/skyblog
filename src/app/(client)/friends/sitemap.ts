'use cache'

import { MetadataRoute } from 'next'
import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  cacheLife('max')
  cacheTag(CACHE_TAG.FRIENDS)

  const friends = await prisma.friend.findMany({
    select: {
      siteUrl: true,
      updatedAt: true
    },
    where: { isActive: true }
  })

  return friends.map(friend => ({
    changeFrequency: 'weekly',
    lastModified: friend.updatedAt,
    priority: 0.5,
    url: friend.siteUrl
  }))
}
