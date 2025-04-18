import createMDX from '@next/mdx'
import { NextConfig } from 'next'
import { serializeOptions } from './src/components/mdx/options'

/**
 * 内容安全策略 (CSP)
 * @see https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
 */
const cspSrc = [process.env.NEXT_PUBLIC_R2_URL, process.env.NEXT_PUBLIC_S3_API.replace('//', `//${process.env.NEXT_PUBLIC_R2_BUCKET_NAME}.`)].join(
  ' '
)
const cspHeader = [
  "default-src 'self'",
  `img-src 'self' blob: data: ${cspSrc}`,
  `connect-src 'self' blob: data: ${cspSrc}`,
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "frame-ancestors 'none'",
  'block-all-mixed-content'
]

const headers: NextConfig['headers'] = async () => [
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

const images: NextConfig['images'] = {
  remotePatterns: [new URL('https://raw.githubusercontent.com')].concat(
    [process.env.NEXT_PUBLIC_WEBSITE_URL, process.env.NEXT_PUBLIC_R2_URL].filter(Boolean).map(it => new URL(it))
  )
}

const redirects: NextConfig['redirects'] = async () => [
  {
    destination: '/pages/1',
    permanent: true,
    source: '/'
  }
]

const rewrites: NextConfig['rewrites'] = async () => [
  {
    destination: 'https://avatars.githubusercontent.com/u/:path*',
    source: '/cdn/avatars.githubusercontent.com/u/:path*'
  },
  {
    destination: 'https://cdn.jsdelivr.net/npm/:package/:path*',
    source: '/cdn/cdn.jsdelivr.net/npm/:package((?:monaco-editor)[@.\\d]*)/:path*'
  }
]

const webpack: NextConfig['webpack'] = config => {
  const svgLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))
  config.module.rules.push({
    oneOf: [
      { ...svgLoaderRule, resourceQuery: /url/, type: 'asset/resource' }, // .svg?url
      { issuer: svgLoaderRule.issuer, resourceQuery: { not: [...svgLoaderRule.resourceQuery.not, /url/] }, use: ['@svgr/webpack'] } // .svg
    ],
    test: /\.svg$/i
  })
  svgLoaderRule.exclude = /\.svg$/i
  return config
}

const nextConfig: NextConfig = {
  headers,
  images,
  redirects,
  rewrites,
  webpack,
  experimental: {
    useCache: true
  },
  pageExtensions: ['mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  typescript: {
    ignoreBuildErrors: true
  }
}

// https://nextjs.org/docs/app/building-your-application/configuring/mdx
const withMDX = createMDX({
  options: serializeOptions.mdxOptions
})

export default withMDX(nextConfig)
