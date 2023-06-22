'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { VariantProps } from 'class-variance-authority'
import React from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog'

export const AlertDialogAction = ({
  className,
  variant,
  ...props
}: Pick<VariantProps<typeof buttonVariants>, 'variant'> & React.ComponentProps<typeof AlertDialogPrimitive.Action>) => {
  return <AlertDialogPrimitive.Action className={cn(buttonVariants({ variant }), className)} {...props} />
}
