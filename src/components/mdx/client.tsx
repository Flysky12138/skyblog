'use client'

import 'katex/dist/katex.min.css'
import { MDXRemote } from 'next-mdx-remote'
import { MDXRemoteProps, MDXRemoteSerializeResult } from 'next-mdx-remote/rsc'
import { serialize } from 'next-mdx-remote/serialize'
import React from 'react'
import { useAsync } from 'react-use'
import { components } from './components'
import './css/katex.css'
import './css/shiki.css'
import { options } from './options.mjs'

interface MDXClientProps {
  value: MDXRemoteProps['source']
}

export const MDXClient = ({ value }: MDXClientProps) => {
  const [source, setSource] = React.useState<MDXRemoteSerializeResult>()

  useAsync(async () => {
    const data = await serialize(value, options)
    React.startTransition(() => {
      setSource(data)
    })
  }, [value])

  if (!source) return null

  return <MDXRemote {...source} components={components} />
}
