import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 1,
      url: new URL('/', process.env.NEXT_PUBLIC_WEBSITE_URL).href
    }
  ]
}
