'use client'

import { ErrorComponent, ErrorComponentProps } from '@/components/error-component'

export default function Error(props: ErrorComponentProps) {
  return <ErrorComponent className="relative" {...props} />
}
