import prisma from '@/lib/prisma'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: Array<StartsWith<'/'>> = ['/']

  // posts
  const postsId = await prisma.post.findMany({
    select: { id: true },
    where: { published: true }
  })
  postsId.forEach(({ id }) => urls.push(`/posts/${id}`))

  return urls.map(url => ({
    changeFrequency: 'daily',
    lastModified: new Date(),
    url: new URL(url, process.env.NEXT_PUBLIC_WEBSITE_URL).href
  }))
}
