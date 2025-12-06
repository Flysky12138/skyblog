import { MetadataRoute } from 'next'

import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
