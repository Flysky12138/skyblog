import * as AlertPrimitive from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { Terminal } from 'lucide-react'

export const Alert = ({ children, className, title, ...props }: React.ComponentProps<typeof AlertPrimitive.Alert>) => {
  return (
    <AlertPrimitive.Alert className={cn('my-6 rounded-md border-l-2 border-l-blue-500/50 bg-transparent shadow-md', className)} {...props}>
      <Terminal className="size-4" />
      {title && <AlertPrimitive.AlertTitle>{title}</AlertPrimitive.AlertTitle>}
      <AlertPrimitive.AlertDescription className="[&_p]:my-0">{children}</AlertPrimitive.AlertDescription>
    </AlertPrimitive.Alert>
  )
}
