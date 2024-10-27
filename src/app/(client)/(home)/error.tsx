'use client'

import CustomError from '@/components/CustomError'

export default function Error(props: ErrorRouteProps) {
  return <CustomError className="relative" {...props} />
}
