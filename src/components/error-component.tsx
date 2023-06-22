import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { RotateCw } from 'lucide-react'
import { ErrorComponent as ErrorComponentType } from 'next/dist/client/components/error-boundary'
import { Card } from './layout/card'

export interface ErrorComponentProps extends React.ComponentProps<ErrorComponentType> {
  className?: string
}

export const ErrorComponent = ({ error, reset, className }: ErrorComponentProps) => {
  return (
    <Card className={cn('flex max-w-xl flex-col items-center justify-center gap-5 px-3 py-5 text-center', className)}>
      <p className="text-lg">Something went wrong!</p>
      <p className="text-subtitle-foreground text-sm break-all">{error.message}</p>
      <Button className="mt-3" variant="outline" onClick={reset}>
        <RotateCw /> 刷新
      </Button>
    </Card>
  )
}
