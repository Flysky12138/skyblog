'use client'

import CustomError from '@/components/CustomError'

export default function Error(props: ErrorBoundary) {
  return <CustomError className="relative" {...props} />
}
