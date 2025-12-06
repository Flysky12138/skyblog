import { RotateCw } from 'lucide-react'
import { ErrorComponent as ErrorComponentType } from 'next/dist/client/components/error-boundary'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

import { Card } from './card'

export interface ErrorComponentProps extends React.ComponentProps<ErrorComponentType> {
  className?: string
}

export const ErrorComponent = ({ className, error, reset }: ErrorComponentProps) => {
  return (
    <Card asChild className={className}>
      <Empty>
        <EmptyHeader className="max-w-none">
          <EmptyTitle>{error.name}</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={reset}>
            <RotateCw /> 刷新
          </Button>
        </EmptyContent>
      </Empty>
    </Card>
  )
}
