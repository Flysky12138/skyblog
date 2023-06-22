import * as AlertPrimitive from '@/components/ui/alert'
import { cn } from '@/lib/cn'
import { Terminal } from 'lucide-react'

export const Alert = ({ title, children, className, ...props }: React.ComponentProps<typeof AlertPrimitive.Alert>) => {
  return (
    <AlertPrimitive.Alert className={cn('my-2', className)} {...props}>
      <Terminal className="size-4" />
      {title && <AlertPrimitive.AlertTitle>{title}</AlertPrimitive.AlertTitle>}
      <AlertPrimitive.AlertDescription className="[&_p]:my-0">{children}</AlertPrimitive.AlertDescription>
    </AlertPrimitive.Alert>
  )
}
