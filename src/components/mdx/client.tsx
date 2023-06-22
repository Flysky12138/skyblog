'use client'

import LoaderThree from '@/assets/lottie/loader-three.json'
import Lottie from '@lottielab/lottie-player/react'
import { MDXRemote } from 'next-mdx-remote'
import { MDXRemoteProps } from 'next-mdx-remote/rsc'
import { serialize } from 'next-mdx-remote/serialize'
import React from 'react'
import { useAsync } from 'react-use'
import { DisplayByConditional } from '../display/display-by-conditional'
import { components } from './components'
import './css'
import { serializeOptions } from './options'

interface MDXClientProps {
  value: MDXRemoteProps['source']
}

const MDXClient_ = ({ value }: MDXClientProps) => {
  const { value: source, loading, error } = useAsync(() => serialize(value, serializeOptions), [value])

  if (!source) {
    return (
      <DisplayByConditional condition={loading} fallback={<div className="flex h-20 items-center justify-center text-xl">无内容</div>}>
        <Lottie className="h-32" lottie={LoaderThree} />
      </DisplayByConditional>
    )
  }
  if (error) return <div className="flex h-20 items-center justify-center text-xl">{error.message}</div>

  return <MDXRemote {...source} components={components} />
}

export const MDXClient = React.memo(MDXClient_)
