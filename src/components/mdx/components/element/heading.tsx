import { Hash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

interface HeadingProps extends React.ComponentProps<'h1'> {
  component: React.ElementType
}

function Heading({ children, className, component: Component, ...props }: HeadingProps) {
  return (
    <Component className={cn('group/heading relative block [&_code]:py-0', className)} {...props}>
      {children}
      <Link replace className="invisible absolute ml-1 -translate-y-0.5 group-hover/heading:visible" href={`#${props.id}`}>
        <Hash className="inline-block size-[1em]" />
      </Link>
    </Component>
  )
}

export const h1 = (props: React.ComponentProps<'h1'>) => <Heading className="border-b-2 pb-2" component="h1" {...props} />
export const h2 = (props: React.ComponentProps<'h2'>) => <Heading className="border-b pb-2" component="h2" {...props} />
export const h3 = (props: React.ComponentProps<'h3'>) => <Heading className="border-b border-dashed pb-1" component="h3" {...props} />
export const h4 = (props: React.ComponentProps<'h4'>) => <Heading component="h4" {...props} />
export const h5 = (props: React.ComponentProps<'h5'>) => <Heading component="h5" {...props} />
export const h6 = (props: React.ComponentProps<'h6'>) => <Heading component="h6" {...props} />
