'use client'

import { Card } from '@repo/ui/components-self/card'
import { Button } from '@repo/ui/components/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@repo/ui/components/empty'
import { cn } from '@repo/ui/lib/utils'
import { RotateCwIcon } from 'lucide-react'
import { ErrorInfo, unstable_catchError } from 'next/error'

export type ErrorProps = ErrorInfo

interface ErrorComponentProps {
  className?: string
}

/**
 * 错误页面
 */
export function ErrorPage({ error, ...props }: React.ComponentProps<typeof ErrorComponent>) {
  return (
    <>
      <title>{error.name}</title>
      <ErrorComponent error={error} {...props} />
    </>
  )
}

function ErrorComponent({ className, error, unstable_retry }: ErrorComponentProps & ErrorInfo) {
  return (
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
            <Button variant="outline" onClick={unstable_retry}>
              <RotateCwIcon /> 刷新
            </Button>
          </EmptyContent>
        </Empty>
      }
    />
  )
}

/**
 * 错误边界
 */
export const ErrorBoundary = unstable_catchError<ErrorComponentProps>((props, errorInfo) => {
  return <ErrorComponent {...props} {...errorInfo} />
})
