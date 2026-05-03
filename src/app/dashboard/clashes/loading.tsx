import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-60" />
      <Skeleton className="h-80 w-full" />
    </div>
  )
}
