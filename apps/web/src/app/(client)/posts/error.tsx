'use client'

import { ErrorPage, ErrorProps } from '@/components/static/error'

export default function Error(props: ErrorProps) {
  return <ErrorPage className="mx-auto" {...props} />
}
