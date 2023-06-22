'use server'

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { components } from './components'
import './css'
import { options } from './options.mjs'

interface MDXServerProps {
  value: MDXRemoteProps['source']
}

export const MDXServer = async ({ value }: MDXServerProps) => {
  return <MDXRemote components={components} options={options} source={value} />
}
