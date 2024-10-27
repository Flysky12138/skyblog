'use client'

import CustomError from '@/components/CustomError'

export default function GlobalError(props: ErrorRouteProps) {
  return (
    <html>
      <body>
        <CustomError {...props} />
      </body>
    </html>
  )
}
