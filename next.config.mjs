import createMDX from '@next/mdx'
import { serializeOptions } from './src/components/mdx/options.mjs'

/** @type {import('next').NextConfig['headers']} */
const headers = async () => {
  const result = [
    {
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=2592000, immutable' }],
      source: '/live2d/:path*'
    }
  ]
  if (process.env.NODE_ENV != 'development') {
    /**
     * 内容安全策略 (CSP)
     *
     * https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
     */
    const cspSrc = [
      process.env.NEXT_PUBLIC_R2_URL,
      process.env.NEXT_PUBLIC_S3_API.replace('//', `//${process.env.NEXT_PUBLIC_R2_BUCKET_NAME}.`),
      process.env.CDN_URL
    ].join(' ')
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
    result.push({
      headers: [{ key: 'Content-Security-Policy', value: cspHeader.join('; ') }],
      source: '/(.*)'
    })
  }
  return result
}

/** @type {import('next').NextConfig['images']} */
const images = {
  remotePatterns: [
    { hostname: '*.public.blob.vercel-storage.com', protocol: 'https' },
    { hostname: 'raw.githubusercontent.com', protocol: 'https' },
    {
      hostname: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL).hostname,
      protocol: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL).protocol.slice(0, -1)
    },
    process.env.NEXT_PUBLIC_R2_URL && {
      hostname: new URL(process.env.NEXT_PUBLIC_R2_URL).hostname,
      protocol: new URL(process.env.NEXT_PUBLIC_R2_URL).protocol.slice(0, -1)
    },
    process.env.CDN_URL && {
      hostname: new URL(process.env.CDN_URL).hostname,
      protocol: new URL(process.env.CDN_URL).protocol.slice(0, -1)
    }
  ].filter(it => it)
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
