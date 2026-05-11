'use client'

import { ThemeProvider } from '@repo/ui/components-self/theme'

import { ErrorComponent, ErrorComponentProps } from '@/components/static/error-component'

export default function GlobalError(props: ErrorComponentProps) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center">
        <ThemeProvider>
          <ErrorComponent {...props} />
        </ThemeProvider>
      </body>
    </html>
  )
}
