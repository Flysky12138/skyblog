import '@/globals.css'

import { FancyboxRegister } from '@repo/ui/components-self/fancybox'
import { ThemeProvider } from '@repo/ui/components-self/theme'
import { Toaster } from '@repo/ui/components/sonner'
import { TooltipProvider } from '@repo/ui/components/tooltip'
import { cn } from '@repo/ui/lib/utils'
import { Metadata, Viewport } from 'next'
import { Cascadia_Code, ZCOOL_KuaiLe } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { prefetchDNS } from 'react-dom'
import { SWRConfig } from 'swr'

import { DisplayByEnv } from '@/components/display/display-by-env'
import { Report } from '@/components/report'

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

const heading = ZCOOL_KuaiLe({ subsets: ['latin'], variable: '--font-heading', weight: '400' })
const code = Cascadia_Code({ adjustFontFallback: false, display: 'swap', subsets: ['latin'], variable: '--font-code' })

export default function Layout({ children }: React.PropsWithChildren) {
  prefetchDNS('https://cdn.jsdelivr.net')

  return (
    <html suppressHydrationWarning dir="ltr" lang="zh-CN">
      <body className={cn(heading.variable, code.variable)}>
        <ThemeProvider>
          <SWRConfig
            value={{
              errorRetryCount: 3
            }}
          >
            <TooltipProvider>{children}</TooltipProvider>
            <DisplayByEnv env="production">
              <Report />
            </DisplayByEnv>
          </SWRConfig>
          <NextTopLoader showSpinner={false} />
          <Toaster />
          <FancyboxRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}
