'use client'

import { evaluate, EvaluateResult } from 'next-mdx-remote-client/rsc'
import React from 'react'
import { useAsync } from 'react-use'
import { useImmer } from 'use-immer'

import { Spinner } from '../ui/spinner'
import './css'
import { components } from './components'
import { mdxOptions } from './options'

interface MDXClientProps {
  source?: string
}

export const MDXClient = React.memo(({ source = '' }: MDXClientProps) => {
  const [{ content, error }, setEvaluateResult] = useImmer<Partial<EvaluateResult>>({})
  const isFirstRender = React.useRef(true)

  const { loading } = useAsync(async () => {
    const result = await evaluate({ components, options: { mdxOptions }, source })
    setEvaluateResult(result)
    isFirstRender.current = false
  }, [source])

  if (loading && isFirstRender.current) {
    return (
      <div className="flex items-center justify-center">
        <Spinner size={32} variant="infinite" />
      </div>
    )
  }
  if (error) return <div className="flex h-20 items-center justify-center text-xl">{error.message}</div>
  if (!content) return <div className="flex h-20 items-center justify-center text-xl">无内容</div>

  return content
})

MDXClient.displayName = 'MDXClient'
