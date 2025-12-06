'use client'

import { ErrorComponent, ErrorComponentProps } from '@/components/static/error-component'
import { ThemeProvider } from '@/providers/theme'

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
