import { Skeleton } from '@repo/ui/components/skeleton'
import { range } from 'es-toolkit'

export default function Loading() {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-4 w-32" />
      </div>
      {range(2).map(index => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-9" />
        </div>
      ))}
      <div className="space-y-3">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
      <div className="space-y-3 pt-8">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
      <Skeleton className="mx-auto h-4 w-24" />
    </div>
  )
}
