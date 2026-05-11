import { Skeleton } from '@repo/ui/components/skeleton'

export default function Loading() {
  return (
    <>
      <Skeleton className="h-9" />
      <Skeleton className="h-32" />
    </>
  )
}
