'use client'

import { ErrorComponent, ErrorComponentProps } from '@/components/static/error-component'

export default function Error(props: ErrorComponentProps) {
  return <ErrorComponent className="max-w-none grow-0" {...props} />
}
