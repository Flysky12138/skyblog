'use client'

import CustomError from '@/components/CustomError'

export default function GlobalError(props: ErrorBoundary) {
  return (
    <html>
      <body>
        <CustomError {...props} />
      </body>
    </html>
  )
}
