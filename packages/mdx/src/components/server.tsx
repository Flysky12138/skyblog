import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote-client/rsc'

import { mdxOptions } from '../lib/options'
import { withComponentProps } from '../lib/utils'
import { components, ComponentsProps } from './elements'

export interface MDXServerProps {
  componentsProps?: ComponentsProps
  source: MDXRemoteProps['source']
}

export async function MDXServer({ componentsProps, ...props }: MDXServerProps) {
  return <MDXRemote components={withComponentProps(components, componentsProps)} options={{ mdxOptions }} {...props} />
}
