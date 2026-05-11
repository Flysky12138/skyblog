import { Card } from '@repo/ui/components-self/card'
import { Button } from '@repo/ui/components/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@repo/ui/components/empty'
import { cn } from '@repo/ui/lib/utils'
import { RotateCwIcon } from 'lucide-react'
import { ErrorComponent as ErrorComponentType } from 'next/dist/client/components/error-boundary'

export interface ErrorComponentProps extends React.ComponentProps<ErrorComponentType> {
  className?: string
}

export function ErrorComponent({ className, error, reset }: ErrorComponentProps) {
  return (
    <>
      <title>{error.name}</title>
      <Card
        className={cn('mx-4 max-w-3xl flex-none', className)}
        data-slot="error"
        render={
          <Empty>
            <EmptyHeader className="max-w-none">
              <EmptyTitle>{error.name}</EmptyTitle>
              <EmptyDescription>{error.message}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={reset}>
                <RotateCwIcon /> 刷新
              </Button>
            </EmptyContent>
          </Empty>
        }
      />
    </>
  )
}
