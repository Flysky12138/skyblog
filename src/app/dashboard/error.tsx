'use client'

import CustomError from '@/components/CustomError'

export default function Error(props: ErrorBoundary) {
  return (
    <section className="absolute inset-0 flex items-center justify-center">
      <CustomError className="relative mx-6 w-full max-w-lg py-10" {...props} />
    </section>
  )
}
