'use client'

import LoaderThree from '@/assets/lottie/loader-three.json'
import Lottie from '@lottielab/lottie-player/react'
import { MDXRemote } from 'next-mdx-remote'
import { MDXRemoteProps } from 'next-mdx-remote/rsc'
import { serialize } from 'next-mdx-remote/serialize'
import { useAsync } from 'react-use'
import { components } from './components'
import './css'
import { serializeOptions } from './options.mjs'

interface MDXClientProps {
  value: MDXRemoteProps['source']
}

export const MDXClient = ({ value }: MDXClientProps) => {
  const { value: source, loading, error } = useAsync(() => serialize(value, serializeOptions), [value])

  if (loading) return <Lottie className="h-32" lottie={LoaderThree} />
  if (error) return <div className="flex h-20 items-center justify-center text-xl">{error.message}</div>
  if (!source) return <div className="flex h-20 items-center justify-center text-xl">无内容</div>

  return <MDXRemote {...source} components={components} />
}
