'use client'

import { useAsync, useImmer } from '@repo/react-hooks'
import { Spinner } from '@repo/ui/components/spinner'
import { evaluate, EvaluateResult } from 'next-mdx-remote-client/rsc'
import React from 'react'

import { mdxOptions } from '../lib/options'
import { components } from './elements'
import { MDXRoot } from './mdx-root'

export interface MDXClientMemoProps {
  loadingRender?: React.ReactNode
  source?: string
  onAfterRender?: (isFirstRender: boolean) => void
}

const MDXClientMemo = React.memo(function MDXClientInner({ loadingRender, source = '', onAfterRender }: MDXClientMemoProps) {
  const isFirstRenderRef = React.useRef(true)

  const [{ content, error }, setEvaluateResult] = useImmer<Partial<EvaluateResult>>({})

  const { loading } = useAsync(async () => {
    if (!source) return

    const result = await evaluate({ components, options: { mdxOptions }, source })
    setEvaluateResult(result)

    const isFirstRender = isFirstRenderRef.current
    isFirstRenderRef.current = false

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onAfterRender?.(isFirstRender)
      })
    })
  }, [source])

  // eslint-disable-next-line react-hooks/refs
  if (loading && isFirstRenderRef.current) {
    return (
      loadingRender ?? (
        <div className="flex h-48 items-center justify-center">
          <Spinner className="size-10" />
        </div>
      )
    )
  }

  if (error) return <div className="flex min-h-20 items-center justify-center text-xl">{error.message}</div>

  return content
})

export function MDXClient({ loadingRender, source, onAfterRender, ...props }: MDXClientMemoProps & React.ComponentProps<typeof MDXRoot>) {
  return (
    <MDXRoot {...props}>
      <MDXClientMemo loadingRender={loadingRender} source={source} onAfterRender={onAfterRender} />
    </MDXRoot>
  )
}
