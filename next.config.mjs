import createMDX from '@next/mdx'
import { serializeOptions } from './src/components/mdx/options.mjs'

/**
 * 内容安全策略 (CSP)
 * https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
 */
const cspSrc = [process.env.NEXT_PUBLIC_R2_URL, process.env.NEXT_PUBLIC_S3_API.replace('//', `//${process.env.NEXT_PUBLIC_R2_BUCKET_NAME}.`)].join(' ')
const cspHeader = [
  "default-src 'self'",
  `connect-src 'self' blob: data: ${cspSrc}`,
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${cspSrc}`,
  "media-src 'self'",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'block-all-mixed-content',
  'upgrade-insecure-requests'
]

/** @type {import('next').NextConfig['headers']} */
const headers = async () => [
  {
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=2592000, immutable' }],
    source: '/live2d/:path*'
  },
  {
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Content-Security-Policy', value: cspHeader.join('; ') }
    ],
    source: '/(.*)'
  },
  {
    headers: [
      { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
      { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" }
    ],
    source: '/sw.js'
  }
]

/** @type {import('next').NextConfig['images']} */
const images = {
  remotePatterns: [{ hostname: 'raw.githubusercontent.com', protocol: 'https' }].concat(
    [process.env.NEXT_PUBLIC_WEBSITE_URL, process.env.NEXT_PUBLIC_R2_URL]
      .filter(it => it)
      .map(it => ({
        hostname: new URL(it).hostname,
        protocol: new URL(it).protocol.slice(0, -1)
      }))
  )
}

/** @type {import('next').NextConfig['redirects']} */
const redirects = async () => [
  {
    destination: '/pages/1',
    permanent: true,
    source: '/'
  }
]

/** @type {import('next').NextConfig['rewrites']} */
const rewrites = async () => [
  {
    destination: 'https://avatars.githubusercontent.com/u/:path*',
    source: '/cdn/avatars.githubusercontent.com/u/:path*'
  },
  {
    destination: 'https://cdn.jsdelivr.net/npm/:package/:path*',
    source: '/cdn/cdn.jsdelivr.net/npm/:package((?:monaco-editor)[@.\\d]*)/:path*'
  }
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers,
  images,
  redirects,
  rewrites,
  pageExtensions: ['mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  }
}

// https://nextjs.org/docs/app/building-your-application/configuring/mdx
const withMDX = createMDX({
  options: serializeOptions.mdxOptions
})

export default withMDX(nextConfig)
