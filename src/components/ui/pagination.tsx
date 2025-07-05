import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import * as React from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => {
  return (
    <nav
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      data-slot="pagination"
      role="navigation"
      {...props}
    />
  )
}

export const PaginationContent = ({ className, ...props }: React.ComponentProps<'ul'>) => {
  return <ul className={cn('flex flex-row items-center gap-1.5', className)} data-slot="pagination-content" {...props} />
}

export const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span aria-hidden className={cn('flex size-9 items-center justify-center', className)} data-slot="pagination-ellipsis" {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export const PaginationItem = ({ ...props }: React.ComponentProps<'li'>) => {
  return <li data-slot="pagination-item" {...props} />
}

export const PaginationLink = ({
  disabled,
  href,
  isActive,
  size = 'icon',
  ...props
}: Pick<React.ComponentProps<typeof Button>, 'size'> & {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  href?: Url
  isActive?: boolean
  onClick?: React.MouseEventHandler
}) => {
  props.className = cn(buttonVariants({ size, variant: isActive ? 'outline' : 'ghost' }), 'dark:border-input border', props.className)

  if (!href || disabled) {
    return <button data-slot="pagination-button" disabled={disabled} {...props} />
  }

  return <Link aria-current={isActive ? 'page' : undefined} data-active={isActive} data-slot="pagination-link" href={href} {...props} />
}

export const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink aria-label="Go to next page" {...props}>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

export const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink aria-label="Go to previous page" {...props}>
      <ChevronLeftIcon />
    </PaginationLink>
  )
}
