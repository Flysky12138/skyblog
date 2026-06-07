'use client'

import { Spinner } from '@repo/ui/components/spinner'
import { evaluate, EvaluateResult } from 'next-mdx-remote-client/rsc'
import React from 'react'
import { useAsync } from 'react-use'
import { useImmer } from 'use-immer'

import { mdxOptions } from '../lib/options'
import { withComponentProps } from '../lib/utils'
import { components, ComponentsProps } from './elements'

export interface MDXClientProps {
  componentsProps?: ComponentsProps
  loading?: React.ReactNode
  source?: null | string
  onAfterRender?: (isFirstRender: boolean) => void
}

export const MDXClient = React.memo(function MDXClientInner({ componentsProps, loading, source = '', onAfterRender }: MDXClientProps) {
  const isFirstRenderRef = React.useRef(true)

  const [{ content, error }, setEvaluateResult] = useImmer<Partial<EvaluateResult>>({})

  const { loading: isLoading } = useAsync(async () => {
    if (!source) return

    const result = await evaluate({
      components: withComponentProps(components, componentsProps),
      options: { mdxOptions },
      source
    })
    setEvaluateResult(result)

    const isFirstRender = isFirstRenderRef.current
    isFirstRenderRef.current = false

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onAfterRender?.(isFirstRender)
      })
    })
  }, [source])

  if (isLoading && isFirstRenderRef.current) {
    return (
      loading ?? (
        <div className="flex h-48 items-center justify-center">
          <Spinner className="size-10" />
        </div>
      )
    )
  }

  if (error) return <div className="flex min-h-20 items-center justify-center text-xl">{error.message}</div>

  return content
})
