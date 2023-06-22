'use server'

import { cn } from '@/lib/cn'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import rehypeSlug from 'rehype-slug'
import { options } from './options.mjs'
import { headingAttr, rehypeHeadingOrder } from './rehype/rehype-heading-order'
import { remarkOnlyHeading } from './remark/remark-only-heading'

interface HeadingPropsType extends React.ComponentProps<'h1'> {
  component: React.ElementType
}

const Heading: React.FC<HeadingPropsType> = ({ component: Component, className, children, id, ...props }) => {
  const deep = Reflect.get(props, headingAttr).split('.').length - 1

  return (
    <Component
      className={cn(
        'group s-subtitle block rounded-md py-0.5 pr-2',
        'data-[active=true]:s-bg-slate data-[active=true]:s-link',
        'relative data-[active=true]:before:absolute data-[active=true]:before:inset-y-0.5 data-[active=true]:before:-left-2 data-[active=true]:before:w-1',
        'data-[active=true]:before:rounded data-[active=true]:before:bg-cyan-500/70',
        className
      )}
      data-active="false"
      style={
        {
          paddingLeft: `${0.5 + deep * 1}rem`
        } satisfies React.CSSProperties
      }
      {...props}
    >
      <Link replace className="block truncate" href={`#${id}`}>
        {children}
      </Link>
    </Component>
  )
}

const heading = {
  h1: (props: any) => <Heading component="h1" {...props} />,
  h2: (props: any) => <Heading component="h2" {...props} />,
  h3: (props: any) => <Heading component="h3" {...props} />,
  h4: (props: any) => <Heading component="h4" {...props} />,
  h5: (props: any) => <Heading component="h5" {...props} />,
  h6: (props: any) => <Heading component="h6" {...props} />
}

export interface MDXTocPropsType {
  value: string
}

export const MDXToc = ({ value }: MDXTocPropsType) => {
  return (
    <MDXRemote
      components={heading}
      options={{
        mdxOptions: {
          rehypePlugins: [rehypeSlug, rehypeHeadingOrder],
          remarkPlugins: (options?.mdxOptions?.remarkPlugins || []).concat(remarkOnlyHeading)
        }
      }}
      source={value}
    />
  )
}
