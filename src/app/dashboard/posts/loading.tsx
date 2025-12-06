import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="gap-card-small flex flex-col">
      <Skeleton className="h-9 max-w-80" />
      <Skeleton className="h-80 w-full" />
    </div>
  )
}
