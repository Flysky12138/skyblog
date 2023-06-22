import { Metadata, Viewport } from 'next'

import '@/globals.css'

import { SessionProvider } from 'next-auth/react'
import { Cascadia_Code, ZCOOL_KuaiLe } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { prefetchDNS } from 'react-dom'

import { Toaster } from '@/components/ui-overwrite/sonner'
import { Report } from '@/components/utils/report'
import { cn } from '@/lib/utils'
import { ImageViewerProvider } from '@/providers/image-viewer'
import { SWRProvider } from '@/providers/swr'
import { ThemeProvider } from '@/providers/theme'

export const metadata: Metadata = {
  authors: [{ name: 'flysky12138', url: 'https://github.com/Flysky12138' }],
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  generator: 'Next.js',
  keywords: ['blog', 'flysky', 'flysky12138', process.env.NEXT_PUBLIC_TITLE],
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL),
  openGraph: {
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
    siteName: process.env.NEXT_PUBLIC_TITLE,
    title: process.env.NEXT_PUBLIC_TITLE,
    type: 'website',
    url: process.env.NEXT_PUBLIC_WEBSITE_URL
  },
  title: {
    default: process.env.NEXT_PUBLIC_TITLE,
    template: `%s | ${process.env.NEXT_PUBLIC_TITLE}`
  },
  twitter: {
    card: 'summary_large_image',
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
    title: process.env.NEXT_PUBLIC_TITLE
  }
}

export const viewport: Viewport = {
  themeColor: [
    { color: '#000000', media: '(prefers-color-scheme: dark)' },
    { color: '#ffffff', media: '(prefers-color-scheme: light)' }
  ]
}

// use it in src/globals.css
const title = ZCOOL_KuaiLe({
  subsets: ['latin'],
  variable: '--font-title',
  weight: '400'
})
const code = Cascadia_Code({
  adjustFontFallback: false,
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-code',
  weight: '400'
})

export default function Layout({ children }: React.PropsWithChildren) {
  prefetchDNS('https://cdn.jsdelivr.net')

  return (
    <html suppressHydrationWarning lang="zh-CN">
      <body className={cn(title.variable, code.variable)}>
        <ThemeProvider>
          <NextTopLoader showSpinner={false} />
          <SessionProvider>
            <SWRProvider>
              <ImageViewerProvider>{children}</ImageViewerProvider>
              <Toaster />
              <Report />
            </SWRProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
