'use client'

import { ErrorPage, ErrorProps } from '@/components/static/error'

export default function Error(props: ErrorProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ErrorPage {...props} />
    </div>
  )
}
