import { MetadataRoute } from 'next'

import { getPosts } from './utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()

  return posts.map(post => ({
    changeFrequency: 'daily',
    lastModified: post.updatedAt,
    priority: 0.8,
    url: new URL(`/posts/${post.slug ?? post.id}`, process.env.NEXT_PUBLIC_WEBSITE_URL).href
  }))
}
