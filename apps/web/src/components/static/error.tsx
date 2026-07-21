'use client'

import { Card } from '@repo/ui/components-self/card'
import { Button } from '@repo/ui/components/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@repo/ui/components/empty'
import { cn } from '@repo/ui/lib/utils'
import { RotateCwIcon } from 'lucide-react'
import { catchError, ErrorInfo } from 'next/error'

export type ErrorProps = ErrorInfo & {
  error: Error & { digest?: string }
}

interface ErrorComponentProps {
  className?: string
}

/**
 * 错误页面
 */
export function ErrorPage({ error, ...props }: ErrorComponentProps & ErrorProps) {
  return (
    <>
      <title>{error.name}</title>
      <ErrorComponent error={error} {...props} />
    </>
  )
}

function ErrorComponent({ className, error, retry }: ErrorComponentProps & ErrorProps) {
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
            <Button variant="outline" onClick={retry}>
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
export const ErrorBoundary = catchError<ErrorComponentProps>((props, errorInfo) => {
  // @ts-ignore
  return <ErrorComponent {...props} {...errorInfo} />
})
