'use client'

import { ThemeProvider } from '@repo/ui/components-self/theme'

import { ErrorPage, ErrorProps } from '@/components/static/error'

export default function GlobalError(props: ErrorProps) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center">
        <ThemeProvider>
          <ErrorPage {...props} />
        </ThemeProvider>
      </body>
    </html>
  )
}
