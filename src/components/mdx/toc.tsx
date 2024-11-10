'use server'

import { cn } from '@/lib/cn'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import rehypeSlug from 'rehype-slug'
import { serializeOptions } from './options.mjs'
import { HEADING_ATTR, rehypeHeadingOrder } from './rehype/rehype-heading-order'
import { remarkPickHeading } from './remark/remark-pick-heading'

interface HeadingProps extends React.ComponentProps<'a'> {}

const Heading: React.FC<HeadingProps> = ({ className, children, id, ...props }) => {
  const deep = Reflect.get(props, HEADING_ATTR).split('.').length - 1

  return (
    <Link
      replace
      className={cn(
        'group s-subtitle relative block rounded-md py-0.5 pr-2',
        'data-[active=true]:bg-slate-200 data-[active=true]:!text-sky-500 data-[active=true]:dark:bg-slate-700',
        'data-[active=true]:before:absolute data-[active=true]:before:inset-y-1 data-[active=true]:before:-left-2 data-[active=true]:before:w-1 data-[active=true]:before:rounded data-[active=true]:before:bg-cyan-500/70',
        'hover:bg-slate-200/50 hover:dark:bg-slate-700/50',
        className
      )}
      data-active="false"
      href={`#${id}`}
      style={{
        paddingLeft: `${0.5 + deep * 1}rem`
      }}
      {...props}
    >
      {children}
    </Link>
  )
}

const heading = {
  h1: (props: object) => <Heading {...props} />,
  h2: (props: object) => <Heading {...props} />,
  h3: (props: object) => <Heading {...props} />,
  h4: (props: object) => <Heading {...props} />,
  h5: (props: object) => <Heading {...props} />,
  h6: (props: object) => <Heading {...props} />
}

export interface MDXTocProps {
  value: string
}

export const MDXToc = async ({ value }: MDXTocProps) => {
  return (
    <MDXRemote
      components={heading}
      options={{
        mdxOptions: {
          rehypePlugins: [rehypeSlug, rehypeHeadingOrder],
          remarkPlugins: (serializeOptions.mdxOptions?.remarkPlugins || []).concat(remarkPickHeading)
        }
      }}
      source={value}
    />
  )
}
