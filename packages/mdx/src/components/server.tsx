'use server'

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote-client/rsc'

import { mdxOptions } from '../lib/options'
import { components } from './elements'
import { MDXRoot } from './mdx-root'

export interface MDXServerProps extends React.ComponentProps<typeof MDXRoot> {
  source: MDXRemoteProps['source']
}

export async function MDXServer({ source, ...props }: MDXServerProps) {
  return (
    <MDXRoot {...props}>
      <MDXRemote components={components} options={{ mdxOptions }} source={source} />
    </MDXRoot>
  )
}
