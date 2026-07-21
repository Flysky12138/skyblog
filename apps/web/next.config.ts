import { NextConfig } from 'next'

import './env.zod'

import path from 'node:path'

// 内容安全策略 (CSP)
// CSP 是一种安全机制，用于限制网页的哪些内容可以加载、执行、显示、或使用
// https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
const cspMap = {
  'default-src': ["'self'"],
  'font-src': ["'self'", 'data:', 'https://esm.sh/@excalidraw/'],
  'frame-ancestors': ["'none'"],
  'frame-src': ["'self'", 'blob:'],
  'media-src': ["'self'", process.env.NEXT_PUBLIC_R2_URL, '*.music.126.net', '*.r2.cloudflarestorage.com'],
  'object-src': ["'none'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", process.env.NEXT_PUBLIC_CDN_FFMPEG],
  'style-src': ["'self'", "'unsafe-inline'"],
  'worker-src': ["'self'", 'blob:'],
  'connect-src': [
    "'self'",
    'blob:',
    'data:',
    process.env.NEXT_PUBLIC_CDN_FFMPEG,
    process.env.NEXT_PUBLIC_R2_URL,
    '*.music.126.net',
    '*.r2.cloudflarestorage.com',
    'https://esm.sh/@excalidraw/'
  ],
  'img-src': [
    "'self'",
    'blob:',
    'data:',
    'https://avatars.githubusercontent.com/u/',
    'https://lh3.googleusercontent.com/a/',
    process.env.NEXT_PUBLIC_R2_URL,
    '*.music.126.net',
    '*.r2.cloudflarestorage.com'
  ]
}

const headers: NextConfig['headers'] = () => [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: Object.entries(cspMap)
          .map(
            ([key, value]) =>
              `${key} ${value
                .sort((a, b) => a.localeCompare(b))
                .filter(Boolean)
                .join(' ')}`
          )
          .join('; ')
      },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'geolocation=(self),camera=(),microphone=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
    ]
  }
]

const images: NextConfig['images'] = {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: []
}

const rewrites: NextConfig['rewrites'] = async () => [
  {
    destination: 'https://cdn.jsdelivr.net/npm/:package/:path*',
    source: '/cdn/cdn.jsdelivr.net/npm/:package((?:monaco-editor)@[.\\d]*)/:path*'
  }
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  headers,
  images,
  pageExtensions: ['ts', 'tsx'],
  partialPrefetching: true,
  reactCompiler: true,
  reactStrictMode: true,
  rewrites,
  staticPageGenerationTimeout: 600,
  transpilePackages: ['@repo/chart-preview', '@repo/monaco-editor', '@repo/react-hooks', '@repo/ui', '@repo/rich-text-editor'],
  typedRoutes: true,
  devIndicators: {
    position: 'bottom-right'
  },
  experimental: {
    turbopackRustReactCompiler: true,
    useOffline: true
  },
  turbopack: {
    root: path.join(process.cwd(), '../..'),
    rules: {
      '*': {
        as: '*.js',
        condition: { query: '?raw' },
        loaders: ['raw-loader']
      },
      '*.svg': {
        as: '*.js',
        loaders: ['@svgr/webpack']
      }
    }
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig
