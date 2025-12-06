import '@/globals.css'

import { Metadata, Viewport } from 'next'
import { Cascadia_Code, ZCOOL_KuaiLe } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { prefetchDNS } from 'react-dom'

import { DisplayByEnv } from '@/components/display/display-by-env'
import { Toaster } from '@/components/ui-overwrite/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FancyboxRegister } from '@/components/utils/fancybox'
import { Report } from '@/components/utils/report'
import { cn } from '@/lib/utils'
import { SWRProvider } from '@/providers/swr'
import { ThemeProvider } from '@/providers/theme'

export const metadata: Metadata = {
  authors: [{ name: 'flysky12138', url: 'https://github.com/Flysky12138' }],
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  generator: 'Next.js',
  keywords: ['blog', 'flysky', 'flysky12138', process.env.NEXT_PUBLIC_TITLE],
  metadataBase: process.env.NEXT_PUBLIC_WEBSITE_URL,
  alternates: {
    canonical: process.env.NEXT_PUBLIC_WEBSITE_URL
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    siteName: process.env.NEXT_PUBLIC_TITLE,
    type: 'website',
    url: process.env.NEXT_PUBLIC_WEBSITE_URL
  },
  title: {
    default: process.env.NEXT_PUBLIC_TITLE,
    template: `%s | ${process.env.NEXT_PUBLIC_TITLE}`
  },
  twitter: {
    card: 'summary',
    creator: '@flysky12138'
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

export default function Layout({ children }: LayoutProps<'/'>) {
  prefetchDNS('https://cdn.jsdelivr.net')

  return (
    <html suppressHydrationWarning dir="ltr" lang="zh-CN">
      <body className={cn(title.variable, code.variable)}>
        <ThemeProvider>
          <SWRProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <DisplayByEnv env="production">
              <Report />
            </DisplayByEnv>
          </SWRProvider>
          <NextTopLoader showSpinner={false} />
          <Toaster />
          <FancyboxRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}
