'use server'

import './css'

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote-client/rsc'

import { components } from './components'
import { mdxOptions } from './options'

interface MDXServerProps {
  source: MDXRemoteProps['source']
}

export async function MDXServer({ source }: MDXServerProps) {
  return <MDXRemote components={components} options={{ mdxOptions }} source={source} />
}
