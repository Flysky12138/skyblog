'use client'

import { ErrorComponent, ErrorComponentProps } from '@/components/static/error-component'

export default function Error(props: ErrorComponentProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ErrorComponent {...props} />
    </div>
  )
}
