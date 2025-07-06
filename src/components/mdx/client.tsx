'use client'

import { evaluate, EvaluateResult } from 'next-mdx-remote-client/rsc'
import React from 'react'
import { useAsync } from 'react-use'
import { useImmer } from 'use-immer'

import Loading from '@/assets/svg/loading.svg'

import { components } from './components'
import './css'
import { mdxOptions } from './options'

interface MDXClientProps {
  source?: string
}

const MDXClient_ = ({ source = '' }: MDXClientProps) => {
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
        <Loading />
      </div>
    )
  }
  if (error) return <div className="flex h-20 items-center justify-center text-xl">{error.message}</div>
  if (!content) return <div className="flex h-20 items-center justify-center text-xl">无内容</div>

  return content
}

export const MDXClient = React.memo(MDXClient_)
