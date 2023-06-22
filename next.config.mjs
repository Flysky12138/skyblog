import createMDX from '@next/mdx'
import { options } from './src/components/mdx/options.mjs'

const githubRepoUrl = `raw.githubusercontent.com/${process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}`

const cspHeader = [
  "default-src 'self'",
  `connect-src 'self' blob: data: api.github.com v1.hitokoto.cn ${githubRepoUrl}`,
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: *.music.126.net ${githubRepoUrl}`,
  "media-src 'self' *.music.126.net",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'block-all-mixed-content',
  'upgrade-insecure-requests'
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core']
  },
  headers: async () => [
    {
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=2592000, immutable' }],
      source: '/live2d/:path*'
    },
    {
      headers: [{ key: 'Content-Security-Policy', value: cspHeader.join('; ') }],
      missing: [
        { key: 'next-router-prefetch', type: 'header' },
        { key: 'purpose', type: 'header', value: 'prefetch' }
      ],
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)'
    }
  ],
  images: {
    remotePatterns: [
      { hostname: '*.public.blob.vercel-storage.com', protocol: 'https' },
      { hostname: 'raw.githubusercontent.com', protocol: 'https' },
      {
        hostname: process.env.NEXT_PUBLIC_WEBSITE_URL.replace(/https?:\/\//, '').replace(/:\d+/, ''),
        protocol: process.env.NODE_ENV == 'development' ? 'http' : 'https'
      }
    ]
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}'
    },
    '@mui/joy': {
      transform: '@mui/joy/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    }
  },
  pageExtensions: ['mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  redirects: async () => [
    {
      destination: '/pages/1',
      permanent: true,
      source: '/'
    }
  ],
  rewrites: async () => [
    {
      destination: 'https://avatars.githubusercontent.com/u/:path*',
      source: '/cdn/avatars.githubusercontent.com/u/:path*'
    },
    {
      destination: 'https://cdn.jsdelivr.net/npm/:package/:path*',
      source: '/cdn/cdn.jsdelivr.net/npm/:package((?:monaco-editor)[@.\\d]*)/:path*'
    }
  ]
}

const withMDX = createMDX({
  options: options.mdxOptions
})

export default withMDX(nextConfig)
