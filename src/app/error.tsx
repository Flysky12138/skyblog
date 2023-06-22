'use client'

import CustomError from '@/components/CustomError'

export default function Error(props: ErrorBoundaryType) {
  return <CustomError className="rounded-none border-none" {...props} />
}
