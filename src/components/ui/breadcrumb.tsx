import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export const Breadcrumb = ({ ...props }: React.ComponentProps<'nav'>) => {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

export const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      aria-hidden="true"
      className={cn('flex size-9 items-center justify-center', className)}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export const BreadcrumbItem = ({ className, ...props }: React.ComponentProps<'li'>) => {
  return <li className={cn('inline-flex items-center gap-1.5', className)} data-slot="breadcrumb-item" {...props} />
}

export const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
}) => {
  const Comp = asChild ? Slot : 'a'

  return <Comp className={cn('hover:text-foreground transition-colors', className)} data-slot="breadcrumb-link" {...props} />
}

export const BreadcrumbList = ({ className, ...props }: React.ComponentProps<'ol'>) => {
  return (
    <ol
      className={cn('text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5', className)}
      data-slot="breadcrumb-list"
      {...props}
    />
  )
}

export const BreadcrumbPage = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn('text-foreground font-normal', className)}
      data-slot="breadcrumb-page"
      role="link"
      {...props}
    />
  )
}

export const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => {
  return (
    <li aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} data-slot="breadcrumb-separator" role="presentation" {...props}>
      {children ?? <ChevronRight />}
    </li>
  )
}
