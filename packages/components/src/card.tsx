import { useRender } from '@repo/ui/base'
import { cn } from '@repo/ui/lib/utils'

export function Card({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      className: cn('rounded-xl bg-card text-card-foreground shadow-xs', 'ring-1 ring-border dark:ring-input', className),
      ...props
    },
    state: {
      slot: 'card'
    }
  })
}
