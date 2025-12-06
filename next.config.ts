import './env.zod'

import createMDX from '@next/mdx'
import withSerwistInit from '@serwist/next'
import { NextConfig } from 'next'

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
  "font-src 'self' data:",
  "object-src 'none'",
  "frame-ancestors 'none'"
].join('; ')

const headers: NextConfig['headers'] = async () => [
  {
    headers: [
      { key: 'Content-Security-Policy', value: cspHeader },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'geolocation=(self),camera=(),microphone=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
    ],
    source: '/(.*)'
  },
  {
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=2592000, immutable' }],
    source: '/live2d/:path*'
  },
  {
    headers: [
      { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          `connect-src 'self' https://avatars.githubusercontent.com/u/ ${process.env.NEXT_PUBLIC_CDN_FFMPEG} ${cspSrc}`,
          "script-src 'self' 'unsafe-eval'"
        ].join('; ')
      },
      { key: 'Content-Type', value: 'application/javascript; charset=utf-8' }
    ],
    source: '/sw.js'
  }
]

const images: NextConfig['images'] = {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [].filter(Boolean).map(item => new URL(item))
}

const rewrites: NextConfig['rewrites'] = async () => [
  {
    destination: 'https://cdn.jsdelivr.net/npm/:package/:path*',
    source: '/cdn/cdn.jsdelivr.net/npm/:package((?:monaco-editor)[@.\\d]*)/:path*'
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

// https://serwist.pages.dev/docs/next/getting-started
const withSerwist = withSerwistInit({
  swDest: 'public/sw.js',
  swSrc: 'src/sw.ts'
})

export default withSerwist(withMDX(nextConfig))
