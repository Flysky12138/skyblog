import { Skeleton } from '@repo/ui/components/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-80 w-full" />
      <Skeleton className="ml-auto h-9 max-w-40" />
    </div>
  )
}
