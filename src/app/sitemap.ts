import { MetadataRoute } from 'next'

import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /** posts */
  const postsId = await prisma.post.findMany({
    select: { id: true, updatedAt: true },
    where: { published: true }
  })

  /** friends */
  const friendsId = await prisma.friend.findMany({
    select: { updatedAt: true, url: true }
  })

  return [
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 1,
      url: new URL('/', process.env.NEXT_PUBLIC_WEBSITE_URL).href
    },
    ...postsId.map(post => {
      return {
        changeFrequency: 'daily',
        lastModified: post.updatedAt,
        priority: 0.8,
        url: new URL(`/posts/${post.id}`, process.env.NEXT_PUBLIC_WEBSITE_URL).href
      } satisfies MetadataRoute.Sitemap[number]
    }),
    ...friendsId.map(friend => {
      return {
        changeFrequency: 'weekly',
        lastModified: friend.updatedAt,
        priority: 0.5,
        url: new URL(friend.url, process.env.NEXT_PUBLIC_WEBSITE_URL).href
      } satisfies MetadataRoute.Sitemap[number]
    })
  ]
}
