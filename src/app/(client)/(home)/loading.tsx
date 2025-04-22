import { Card } from '@/components/layout/card'
import { cn } from '@/lib/utils'

export default function Loading() {
  return Array.from({ length: 4 }).map((_, index) => (
    <Card
      key={index}
      className={cn('flex flex-col justify-center gap-4 p-5', {
        'md:hidden': index == 0
      })}
    >
      <div className="skeleton h-7 w-60 rounded-md" />
      <div className="skeleton h-5 w-40 rounded-md" />
      <div className="skeleton h-5 w-full max-w-sm rounded-md" />
    </Card>
  ))
}
