'use client'

import { ErrorComponent, ErrorComponentProps } from '@/components/error-component'

export default function Error(props: ErrorComponentProps) {
  return (
    <section className="absolute inset-0 flex items-center justify-center">
      <ErrorComponent {...props} />
    </section>
  )
}
