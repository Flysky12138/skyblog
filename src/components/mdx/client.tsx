'use client'

import { evaluate, EvaluateResult } from 'next-mdx-remote-client/rsc'
import React from 'react'
import { useAsync } from 'react-use'
import { useImmer } from 'use-immer'

import { DisplayByConditional } from '../display/display-by-conditional'
import './css'
import { Spinner } from '../ui/spinner'
import { components } from './components'
import { mdxOptions } from './options'

interface MDXClientProps {
  loadingRender?: React.ReactNode
  source?: string
}

export const MDXClient = React.memo(({ loadingRender: fallback, source = '' }: MDXClientProps) => {
  const [{ content, error }, setEvaluateResult] = useImmer<Partial<EvaluateResult>>({})
  const isFirstRender = React.useRef(true)

  const { loading } = useAsync(async () => {
    const result = await evaluate({ components, options: { mdxOptions }, source })
    setEvaluateResult(result)
    isFirstRender.current = false
  }, [source])

  // eslint-disable-next-line react-hooks/refs
  if (loading && isFirstRender.current) {
    return (
      <DisplayByConditional
        condition={!!fallback}
        fallback={
          <div className="flex h-48 items-center justify-center">
            <Spinner className="size-10" />
          </div>
        }
      >
        {fallback}
      </DisplayByConditional>
    )
  }
  if (error) return <div className="flex h-20 items-center justify-center text-xl">{error.message}</div>
  if (!content) return <div className="flex h-20 items-center justify-center text-xl">无内容</div>

  return content
})

MDXClient.displayName = 'MDXClient'
