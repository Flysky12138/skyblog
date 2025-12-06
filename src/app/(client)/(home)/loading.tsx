import { Card } from '@/components/static/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function Loading() {
  return (
    <>
      <div className="-order-1 ml-auto flex h-9 gap-2">
        <Card className="w-9 rounded-md" />
        <Card className="w-32 rounded-md" />
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card
          key={index}
          className={cn('p-card space-y-3 lg:space-y-4', {
            'md:hidden': index == 0
          })}
        >
          <Skeleton className="h-7 w-60" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-full max-w-sm" />
        </Card>
      ))}
    </>
  )
}
