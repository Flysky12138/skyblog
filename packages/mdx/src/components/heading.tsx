import { MDXRemote } from 'next-mdx-remote-client/rsc'
import React from 'react'
import rehypeSlug from 'rehype-slug'

import { remarkPlugins } from '../lib/options'
import { rehypeHeadingOrder } from '../plugins/rehype/rehype-heading-level'
import { remarkPickHeading } from '../plugins/remark/remark-pick-heading'

export interface MDXHeadingProps {
  component: React.ElementType | React.FunctionComponent<React.ComponentProps<'h1'>>
  source: string
}

export async function MDXHeading({ component, source }: MDXHeadingProps) {
  return (
    <MDXRemote
      components={{
        h1: component,
        h2: component,
        h3: component,
        h4: component,
        h5: component,
        h6: component
      }}
      options={{
        mdxOptions: {
          rehypePlugins: [rehypeSlug, rehypeHeadingOrder],
          remarkPlugins: [remarkPickHeading, ...remarkPlugins]
        }
      }}
      source={source}
    />
  )
}
