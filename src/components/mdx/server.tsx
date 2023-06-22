'use server'

import 'katex/dist/katex.min.css'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { components } from './components'
import './css/katex.css'
import './css/shiki.css'
import { options } from './options.mjs'

interface MDXServerProps {
  value: MDXRemoteProps['source']
}

export const MDXServer = async ({ value }: MDXServerProps) => {
  return <MDXRemote components={components} options={options} source={value} />
}
