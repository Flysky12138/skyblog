import { MetadataRoute } from 'next'

// https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt?hl=zh-cn#create_rules

const allow: StartsWith<'/'>[] = ['/posts/', '/friends', '/toolbox']
const disallow: StartsWith<'/'>[] = ['/dashboard/', '/auth/', '/api/', '/ban', '/_next/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: allow.sort((a, b) => a.localeCompare(b)),
      disallow: disallow.sort((a, b) => a.localeCompare(b)),
      userAgent: '*'
    },
    sitemap: [
      new URL('/sitemap.xml', process.env.NEXT_PUBLIC_WEBSITE_URL).href,
      new URL('/posts/sitemap.xml', process.env.NEXT_PUBLIC_WEBSITE_URL).href,
      new URL('/friends/sitemap.xml', process.env.NEXT_PUBLIC_WEBSITE_URL).href
    ]
  }
}
