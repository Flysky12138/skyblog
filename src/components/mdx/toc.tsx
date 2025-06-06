'use server'

import { MDXRemote } from 'next-mdx-remote-client/rsc'
import Link from 'next/link'
import rehypeSlug from 'rehype-slug'

import { cn } from '@/lib/utils'

import { remarkPlugins } from './options'
import { HEADING_ATTRIBUTE, rehypeHeadingOrder } from './rehype/rehype-heading-level'
import { remarkPickHeading } from './remark/remark-pick-heading'

export interface MDXTocProps {
  source: string
}

export const MDXToc = async ({ source }: MDXTocProps) => {
  return (
    <MDXRemote
      components={{
        h1: Heading,
        h2: Heading,
        h3: Heading,
        h4: Heading,
        h5: Heading,
        h6: Heading
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

const Heading = ({ children, className, id, ...props }: React.ComponentProps<'a'>) => {
  const depth = Reflect.get(props, HEADING_ATTRIBUTE).split('.').length - 1

  return (
    <Link
      replace
      className={cn(
        'relative block rounded-md py-1 pr-2',
        'data-active:text-link-foreground data-active:bg-link',
        'data-active:before:bg-link-foreground/60 data-active:before:absolute data-active:before:inset-y-1 data-active:before:-left-2 data-active:before:w-1 data-active:before:rounded-md',
        'hover:text-link-foreground hover:bg-link/30',
        className
      )}
      href={`#${id}`}
      style={{
        paddingLeft: `${0.5 + depth}rem`
      }}
      {...props}
    >
      <span className="block w-full truncate text-sm font-semibold">{children}</span>
    </Link>
  )
}
