'use client'

import { ErrorPage, ErrorProps } from '@/components/static/error'

export default function Error(props: ErrorProps) {
  return (
    <div className="flex size-full items-center justify-center">
      <ErrorPage {...props} />
    </div>
  )
}
