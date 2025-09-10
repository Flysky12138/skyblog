import { Metadata, Viewport } from 'next'

import '@/globals.css'

import { SessionProvider } from 'next-auth/react'
import { Cascadia_Code, ZCOOL_KuaiLe } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import { Report } from '@/components/report'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
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

// use it in src/globals.css
const title = ZCOOL_KuaiLe({
  subsets: ['latin'],
  variable: '--font-title',
  weight: '400'
})
const code = Cascadia_Code({
  subsets: ['latin'],
  variable: '--font-code',
  weight: '400'
})

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="zh-CN">
      <body className={cn(title.variable, code.variable)}>
        <ThemeProvider>
          <NextTopLoader showSpinner={false} />
          <SessionProvider>
            <SWRProvider>
              <ImageViewerProvider>{children}</ImageViewerProvider>
              <Toaster />
              <Toaster expand id="expand" visibleToasts={5} />
              <Report />
            </SWRProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
