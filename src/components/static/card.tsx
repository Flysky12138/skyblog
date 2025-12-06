import { Root, SlotProps } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

interface CardProps extends SlotProps {
  asChild?: boolean
}

export function Card({ asChild, className, ...props }: CardProps) {
  const Comp = asChild ? Root : 'div'

  return <Comp className={cn('bg-card border-card-border light:border-transparent rounded-lg border shadow-sm', className)} {...props} />
}
