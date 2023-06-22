'use client'

import { ErrorComponent, ErrorComponentProps } from '@/components/static/error-component'

export default function Error(props: ErrorComponentProps) {
  return (
    <div className="flex size-full items-center justify-center">
      <ErrorComponent className="relative mx-6 w-full max-w-lg py-10" {...props} />
    </div>
  )
}
