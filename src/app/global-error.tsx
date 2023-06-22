'use client'

import { ErrorComponent, ErrorComponentProps } from '@/components/static/error-component'

export default function GlobalError(props: ErrorComponentProps) {
  return (
    <html>
      <body>
        <ErrorComponent {...props} />
      </body>
    </html>
  )
}
