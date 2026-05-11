import * as AlertPrimitive from '@repo/ui/components/alert'
import { cn } from '@repo/ui/lib/utils'
import { TerminalIcon } from 'lucide-react'

export function Alert({ children, className, title, ...props }: React.ComponentProps<typeof AlertPrimitive.Alert>) {
  return (
    <AlertPrimitive.Alert
      className={cn(
        'gap-3 rounded-md border-s-3 border-l-blue-500/50',
        {
          '*:[svg]:row-span-1': !title
        },
        className
      )}
      {...props}
    >
      <TerminalIcon className="size-4" />
      {title && <AlertPrimitive.AlertTitle>{title}</AlertPrimitive.AlertTitle>}
      <div className="text-sm text-balance text-muted-foreground *:first:mbs-0 *:last:mbe-0 md:text-pretty" data-slot="alert-description">
        {children}
      </div>
    </AlertPrimitive.Alert>
  )
}
