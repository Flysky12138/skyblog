import { Toaster } from '@/components/ui/sonner'
import '@/globals.css'
import { ImageViewerProvider } from '@/providers/image-viewer'
import { SWRProvider } from '@/providers/swr'
import { ThemeProvider } from '@/providers/theme'
import { Metadata, Viewport } from 'next'
import { SessionProvider } from 'next-auth/react'
import { ZCOOL_KuaiLe } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  generator: 'Next.js',
  title: {
    default: process.env.NEXT_PUBLIC_TITLE,
    template: `%s · ${process.env.NEXT_PUBLIC_TITLE}`
  }
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
            </SWRProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
