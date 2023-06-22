import createMDX from '@next/mdx'
import { NextConfig } from 'next'

import './env.zod'
import { mdxOptions } from './src/components/mdx/options'

/**
 * 内容安全策略 (CSP)
 * @see https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
 */
const cspSrc = [
  process.env.NEXT_PUBLIC_R2_URL,
  process.env.NEXT_PUBLIC_S3_API.replace('//', `//${process.env.NEXT_PUBLIC_R2_BUCKET_NAME}.`),
  '*.music.126.net'
]
  .filter(Boolean)
  .join(' ')
const cspHeader = [
  "default-src 'self'",
  `img-src 'self' blob: data: https://avatars.githubusercontent.com/u/ ${cspSrc}`,
  `media-src 'self' ${cspSrc}`,
  `connect-src 'self' blob: data: ${process.env.NEXT_PUBLIC_CDN_FFMPEG} ${cspSrc}`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${process.env.NEXT_PUBLIC_CDN_FFMPEG}`,
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "frame-ancestors 'none'"
]

const headers: NextConfig['headers'] = async () => [
  {
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=2592000, immutable' }],
    source: '/live2d/:path*'
  },
  {
    headers: [
      { key: 'Content-Security-Policy', value: cspHeader.join('; ') },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'geolocation=(self),camera=(),microphone=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' }
    ],
    source: '/(.*)'
  },
  {
    headers: [
      { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
      { key: 'Content-Type', value: 'application/javascript; charset=utf-8' }
    ],
    source: '/sw.js'
  }
]

const images: NextConfig['images'] = {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [].filter(Boolean).map(item => new URL(item))
}

const redirects: NextConfig['redirects'] = async () => [
  {
    destination: '/page/1',
    permanent: true,
    source: '/'
  }
]

const rewrites: NextConfig['rewrites'] = async () => [
  {
    destination: 'https://cdn.jsdelivr.net/npm/:package/:path*',
    source: '/cdn/cdn.jsdelivr.net/npm/:package((?:monaco-editor)[@.\\d]*)/:path*'
  },
  {
    destination: 'https://app.rybbit.io/api/script.js',
    source: '/api/script.js'
  },
  {
    destination: 'https://app.rybbit.io/api/track',
    source: '/api/track'
  }
]

const webpack: NextConfig['webpack'] = config => {
  const svgLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))
  config.module.rules.push(
    {
      oneOf: [
        { ...svgLoaderRule, resourceQuery: /url/ }, // *.svg?url
        { issuer: svgLoaderRule.issuer, resourceQuery: { not: [...svgLoaderRule.resourceQuery.not, /url/] }, use: ['@svgr/webpack'] } // *.svg
      ],
      test: /\.svg$/i
    },
    {
      resourceQuery: /raw/,
      type: 'asset/source'
    }
  )
  svgLoaderRule.exclude = /\.svg$/i
  return config
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  headers,
  images,
  pageExtensions: ['mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  redirects,
  rewrites,
  serverExternalPackages: ['NeteaseCloudMusicApi'],
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: true
  },
  webpack
}

// https://nextjs.org/docs/app/building-your-application/configuring/mdx
const withMDX = createMDX({
  options: mdxOptions
})

export default withMDX(nextConfig)
