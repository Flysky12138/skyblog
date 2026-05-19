import { Card } from '@repo/ui/components-self/card'
import { Skeleton } from '@repo/ui/components/skeleton'
import { cn } from '@repo/ui/lib/utils'
import { range } from 'es-toolkit'

export default function Loading() {
  return (
    <>
      <div className="-order-1 ml-auto flex h-9 gap-2">
        <Card className="w-9" variant="button" />
        <Card className="w-32" variant="button" />
      </div>
      {range(4).map(index => (
        <Card
          key={index}
          className={cn('space-y-3 p-card lg:space-y-4', {
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
