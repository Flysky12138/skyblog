'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import React from 'react'

interface PaginationLinkProps extends Pick<React.ComponentProps<typeof Button>, 'size'>, React.PropsWithChildren {
  className?: string
  disabled?: boolean
  href?: Url
  isActive?: boolean
  onClick?: React.MouseEventHandler
}

export const PaginationLink = ({ className, disabled, href, isActive, size = 'icon', ...props }: PaginationLinkProps) => {
  if (!href || disabled) {
    return (
      <button
        className={cn(
          buttonVariants({ size, variant: isActive ? 'outline' : 'ghost' }),
          {
            'opacity-50': disabled
          },
          className
        )}
        disabled={disabled}
        {...props}
      />
    )
  }

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(buttonVariants({ size, variant: isActive ? 'outline' : 'ghost' }), className)}
      data-active={isActive}
      data-slot="pagination-link"
      href={href}
      {...props}
    />
  )
}
