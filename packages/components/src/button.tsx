import { buttonVariants } from '@repo/ui/components/button'
import * as ButtonPrimitive from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import React from 'react'

/**
 * 添加 Link 按键
 *
 * @see https://ui.shadcn.com/docs/components/base/button#as-link
 */
export function ButtonLink({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof ButtonPrimitive.Button> & React.ComponentProps<typeof Link>) {
  return <Link className={cn(buttonVariants({ size, variant }), className)} {...props} />
}
