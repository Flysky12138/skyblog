import { MetadataRoute } from 'next'

import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: StartsWith<'/'>[] = ['/']

  // posts
  const postsId = await prisma.post.findMany({
    select: { id: true },
    where: { published: true }
  })
  postsId.forEach(({ id }) => urls.push(`/posts/${id}`))

  // friends
  const friendsId = await prisma.friend.findMany({
    select: { url: true }
  })
  friendsId.forEach(({ url }) => urls.push(url as StartsWith<'/'>))

  return urls.map(url => ({
    changeFrequency: 'daily',
    lastModified: new Date(),
    url: new URL(url, process.env.NEXT_PUBLIC_WEBSITE_URL).href
  }))
}
