import { Card } from '@/components/static/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function Loading() {
  return Array.from({ length: 4 }).map((_, index) => (
    <Card
      key={index}
      className={cn('p-card flex flex-col justify-center gap-4', {
        'md:hidden': index == 0
      })}
    >
      <Skeleton className="h-7 w-60" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-5 w-full max-w-sm" />
    </Card>
  ))
}
