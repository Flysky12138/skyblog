import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Route } from 'next'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import React from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '../ui/pagination'

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

  return <Link aria-current={isActive ? 'page' : undefined} data-active={isActive} data-slot="pagination-link" href={href as Route} {...props} />
}

export const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink aria-label="Go to previous page" {...props}>
      <ChevronLeftIcon />
      <span className="sr-only">Previous</span>
    </PaginationLink>
  )
}

export const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink aria-label="Go to next page" {...props}>
      <span className="sr-only">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}
