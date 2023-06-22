'use client'

import { ErrorComponent, ErrorComponentProps } from '@/components/error-component'

export default function Error(props: ErrorComponentProps) {
  return (
    <section className="flex size-full items-center justify-center">
      <ErrorComponent className="relative mx-6 w-full max-w-lg py-10" {...props} />
    </section>
  )
}
