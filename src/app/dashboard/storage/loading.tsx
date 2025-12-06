import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-80 w-full" />
    </>
  )
}
