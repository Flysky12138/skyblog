'use client'

import CustomError from '@/components/CustomError'

export default function GlobalError(props: ErrorBoundaryType) {
  return (
    <html>
      <body>
        <CustomError {...props} />
      </body>
    </html>
  )
}
