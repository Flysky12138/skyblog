'use client'

import CustomError from '@/components/CustomError'

export default function Error(props: ErrorRouteProps) {
  return <CustomError className="rounded-none border-none" {...props} />
}
