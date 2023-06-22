import Toaster from '@/components/Toaster'
import '@/globals.css'
import { ImageViewerProvider } from '@/provider/image-viewer'
import { SWRProvider } from '@/provider/swr'
import { ThemeProvider } from '@/provider/theme'
import { Metadata, Viewport } from 'next'
import { SessionProvider } from 'next-auth/react'
import { ZCOOL_KuaiLe } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  generator: 'Next.js',
  title: {
    default: process.env.NEXT_PUBLIC_TITLE,
    template: `%s | ${process.env.NEXT_PUBLIC_TITLE}`
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
  variable: '--font-title', // use it in tailwind.config.js
  weight: '400'
})

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="zh-CN">
      <body className={title.variable} id="next">
        <NextTopLoader showSpinner={false} />
        <SessionProvider>
          <SWRProvider>
            <ThemeProvider>
              <ImageViewerProvider>{children}</ImageViewerProvider>
              <Toaster />
            </ThemeProvider>
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
