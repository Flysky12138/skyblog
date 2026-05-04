import { Card } from '@/components/static/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <Card className="space-y-2 p-3 md:p-5">
        <Skeleton className="h-9 w-60" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-full max-w-sm" />
      </Card>
      <Card className="h-72" />
    </>
  )
}
