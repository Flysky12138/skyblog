'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import React from 'react'

import { cn } from '@/lib/utils'

import { DialogOverlay, DialogPortal } from '../ui/dialog'

export {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'

export const DialogContent = ({
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) => {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay className="flex justify-center overflow-y-auto p-4 backdrop-blur-sm sm:p-6">
        <DialogPrimitive.Content
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200',
            'bg-background relative z-50 my-auto flex h-fit w-full flex-col gap-4 rounded-lg border p-3 shadow-lg sm:p-6',
            className
          )}
          data-slot="dialog-content"
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                'ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity disabled:pointer-events-none',
                'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
                'focus:ring-ring hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden',
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              )}
              data-slot="dialog-close"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  )
}
