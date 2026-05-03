import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-9 max-w-80" />
      <Skeleton className="h-80 w-full" />
    </div>
  )
}
