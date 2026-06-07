import { Card } from '@repo/ui/components-self/card'
import { buttonVariants } from '@repo/ui/components/button'
import { Skeleton } from '@repo/ui/components/skeleton'
import { cn } from '@repo/ui/lib/utils'
import { range } from 'es-toolkit'

export default function Loading() {
  return (
    <>
      <div className="pointer-events-none -order-1 ml-auto flex h-9 gap-2">
        <div className={buttonVariants({ size: 'icon', variant: 'outline' })} />
        <div className={buttonVariants({ className: 'w-32', variant: 'outline' })} />
      </div>
      {range(4).map(index => (
        <Card
          key={index}
          className={cn('space-y-3 p-card lg:space-y-4', {
            'md:hidden': index === 0
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
