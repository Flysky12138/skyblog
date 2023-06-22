'use server'

import 'katex/dist/katex.min.css'
import './prism.css'

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { components } from './components'
import { options } from './options.mjs'

interface MDXServerProps {
  value: MDXRemoteProps['source']
}

export const MDXServer = async ({ value }: MDXServerProps) => {
  return <MDXRemote components={components} options={options} source={value} />
}
