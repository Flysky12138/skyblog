'use server'

import { MDXRemote } from 'next-mdx-remote-client/rsc'
import React from 'react'
import rehypeSlug from 'rehype-slug'

import { remarkPlugins } from './options'
import { rehypeHeadingOrder } from './rehype/rehype-heading-level'
import { remarkPickHeading } from './remark/remark-pick-heading'

export interface MDXPickHeadingProps {
  headingComponent: React.ElementType | React.FunctionComponent<React.ComponentProps<'h1'>>
  source: string
}

export const MDXPickHeading = async ({ headingComponent, source }: MDXPickHeadingProps) => {
  return (
    <MDXRemote
      components={{
        h1: headingComponent,
        h2: headingComponent,
        h3: headingComponent,
        h4: headingComponent,
        h5: headingComponent,
        h6: headingComponent
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
