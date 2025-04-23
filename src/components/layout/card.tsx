import { cn } from '@/lib/utils'
import { Root, SlotProps } from '@radix-ui/react-slot'

interface CardProps extends SlotProps {
  asChild?: boolean
}

export const Card = ({ asChild, className, ...props }: CardProps) => {
  const Comp = asChild ? Root : 'section'

  return <Comp className={cn('bg-card border-card-border light:border-transparent rounded-lg border shadow-sm', className)} {...props} />
}
