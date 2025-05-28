'use server'

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote-client/rsc'

import { components } from './components'
import './css'
import { mdxOptions } from './options'

interface MDXServerProps {
  source: MDXRemoteProps['source']
}

export const MDXServer = async ({ source }: MDXServerProps) => {
  return <MDXRemote components={components} options={{ mdxOptions }} source={source} />
}
