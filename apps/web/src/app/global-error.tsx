'use client'

import { ThemeProvider } from '@repo/components/theme'

import { ErrorPage, ErrorProps } from '@/components/static/error'

export default function GlobalError(props: ErrorProps) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen items-center justify-center">
        <ThemeProvider>
          <ErrorPage {...props} />
        </ThemeProvider>
      </body>
    </html>
  )
}
