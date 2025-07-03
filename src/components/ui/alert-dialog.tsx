'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { buttonVariants } from 'ui/button'

import { cn } from '@/lib/utils'

export const AlertDialog = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) => {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

export const AlertDialogAction = ({
  className,
  variant,
  ...props
}: Pick<VariantProps<typeof buttonVariants>, 'variant'> & React.ComponentProps<typeof AlertDialogPrimitive.Action>) => {
  return <AlertDialogPrimitive.Action className={cn(buttonVariants({ variant }), className)} {...props} />
}

export const AlertDialogCancel = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) => {
  return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: 'outline' }), className)} {...props} />
}

export const AlertDialogContent = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        data-slot="alert-dialog-content"
        {...props}
      />
    </AlertDialogPortal>
  )
}

export const AlertDialogDescription = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) => {
  return (
    <AlertDialogPrimitive.Description className={cn('text-muted-foreground text-sm', className)} data-slot="alert-dialog-description" {...props} />
  )
}

export const AlertDialogFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} data-slot="alert-dialog-footer" {...props} />
}

export const AlertDialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} data-slot="alert-dialog-header" {...props} />
}

export const AlertDialogOverlay = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) => {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      data-slot="alert-dialog-overlay"
      {...props}
    />
  )
}

export const AlertDialogPortal = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) => {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

export const AlertDialogTitle = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) => {
  return <AlertDialogPrimitive.Title className={cn('text-lg font-semibold', className)} data-slot="alert-dialog-title" {...props} />
}

export const AlertDialogTrigger = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) => {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}
