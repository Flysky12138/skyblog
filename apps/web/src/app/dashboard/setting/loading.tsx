import { Skeleton } from '@repo/ui/components/skeleton'
import { range } from 'es-toolkit'

export default function Loading() {
  return (
    <div className="flex flex-col gap-bp-4">
      {range(2).map(key => (
        <div key={key} className="flex flex-col gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  )
}
