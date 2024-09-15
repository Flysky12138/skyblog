import LinkIcon from '@/components/svg-icon/Link'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import React from 'react'

interface HeadingProps extends React.ComponentProps<'h1'> {
  component: React.ElementType
}

const Heading: React.FC<HeadingProps> = ({ component: Component, className, children, ...props }) => {
  return (
    <Component className={cn('group block [&_code]:py-0', className)} {...props}>
      {children}
      <Link replace className="ml-3 hidden group-hover:inline-block [&_svg]:fill-[--tw-prose-links] [&_svg]:text-base" href={`#${props.id}`}>
        <LinkIcon />
      </Link>
    </Component>
  )
}

export const h1 = (props: object) => <Heading className="border-b border-slate-300 pb-2 dark:border-slate-600" component="h1" {...props} />
export const h2 = (props: object) => <Heading className="border-b border-dashed border-slate-300 pb-1 dark:border-slate-600" component="h2" {...props} />
export const h3 = (props: object) => <Heading component="h3" {...props} />
export const h4 = (props: object) => <Heading component="h4" {...props} />
export const h5 = (props: object) => <Heading component="h5" {...props} />
export const h6 = (props: object) => <Heading component="h6" {...props} />
