import { MetadataRoute } from 'next'

// https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt?hl=zh-cn#create_rules

const allow: StartsWith<'/'>[] = ['/posts/', '/friends']
const disallow: StartsWith<'/'>[] = ['/dashboard/', '/auth/', '/api/', '/posts/page/', '/posts/search']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow, disallow, userAgent: '*' },
    sitemap: new URL('/sitemap.xml', process.env.NEXT_PUBLIC_WEBSITE_URL).href
  }
}
