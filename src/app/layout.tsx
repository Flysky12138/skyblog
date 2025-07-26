import { Metadata, Viewport } from 'next'

import '@/globals.css'

import { SessionProvider } from 'next-auth/react'
import { ZCOOL_KuaiLe } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import { Report } from '@/components/report'
import { Toaster } from '@/components/ui/sonner'
import { ImageViewerProvider } from '@/providers/image-viewer'
import { SWRProvider } from '@/providers/swr'
import { ThemeProvider } from '@/providers/theme'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  generator: 'Next.js',
  title: process.env.NEXT_PUBLIC_TITLE
}

export const viewport: Viewport = {
  themeColor: [
    { color: '#000000', media: '(prefers-color-scheme: dark)' },
    { color: '#ffffff', media: '(prefers-color-scheme: light)' }
  ]
}

const title = ZCOOL_KuaiLe({
  subsets: ['latin'],
  variable: '--font-title', // use it in src/globals.css
  weight: '400'
})

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="zh-CN">
      <body className={title.variable}>
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
