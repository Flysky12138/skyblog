import { MetadataRoute } from 'next'

import { toolGroup } from './utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hrefs = toolGroup.flatMap(group => group.children.map(child => child.href))

  return hrefs.map(href => ({
    changeFrequency: 'daily',
    lastModified: new Date(),
    priority: 0.8,
    url: new URL(href, process.env.NEXT_PUBLIC_WEBSITE_URL).href
  }))
}
