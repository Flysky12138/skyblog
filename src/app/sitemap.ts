'use cache'

import { MetadataRoute } from 'next'
import { cacheLife, cacheTag } from 'next/cache'

import { CacheTag } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

import { POST_WHERE_INPUT } from './(client)/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  cacheLife('max')
  cacheTag(CacheTag.FRIEND, CacheTag.POST)

  const posts = await prisma.post.findMany({
    select: { id: true, updatedAt: true },
    where: POST_WHERE_INPUT
  })
  const friends = await prisma.friend.findMany({
    select: { updatedAt: true, url: true }
  })

  return Array.of<MetadataRoute.Sitemap[number]>().concat(
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 1,
      url: new URL('/', process.env.NEXT_PUBLIC_WEBSITE_URL).href
    },
    posts.map(post => ({
      changeFrequency: 'daily',
      lastModified: post.updatedAt,
      priority: 0.8,
      url: new URL(`/posts/${post.id}`, process.env.NEXT_PUBLIC_WEBSITE_URL).href
    })),
    friends.map(friend => ({
      changeFrequency: 'weekly',
      lastModified: friend.updatedAt,
      priority: 0.5,
      url: friend.url
    }))
  )
}
