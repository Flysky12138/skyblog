import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-full max-w-40" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
