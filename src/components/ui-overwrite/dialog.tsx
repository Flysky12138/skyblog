'use client'

// eslint-disable-next-line no-restricted-imports
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { DialogClose, DialogOverlay, DialogPortal } from '../ui/dialog'

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

/**
 * 让整个内容块可滚动
 */
export function DialogContent({
  children,
  className,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay className="duration-200" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex justify-center overflow-y-auto p-4 sm:p-6 md:p-10" data-slot="dialog-viewport">
        <DialogPrimitive.Popup
          className={cn(
            'gap-bp-3 relative flex flex-col',
            'my-auto w-full max-w-[calc(100%-2rem)] overflow-hidden rounded-lg p-5 duration-200',
            'bg-popover text-popover-foreground ring-foreground/10 ring-1',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            'data-nested-dialog-open:animate-out fill-mode-forwards data-nested-dialog-open:fade-out-0 data-nested-dialog-open:zoom-out-95',
            className
          )}
          data-slot="dialog-content"
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogClose render={<Button className="absolute top-5 right-5" size="icon-sm" variant="ghost" />}>
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  )
}
