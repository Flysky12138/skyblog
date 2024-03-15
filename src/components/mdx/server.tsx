'use server'

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { components } from './components'
import { options } from './options.mjs'

import 'katex/dist/katex.min.css'
import './prism.scss'

interface MDXServerProps {
  value: MDXRemoteProps['source']
}

export const MDXServer = ({ value }: MDXServerProps) => {
  return <MDXRemote components={components} options={options} source={value} />
}
