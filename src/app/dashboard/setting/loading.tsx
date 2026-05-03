import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="gap-bp-4 flex flex-col">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  )
}
