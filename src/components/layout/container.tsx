import { cn } from '@/lib/utils'
import { Root, SlotProps } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'

const toggleVariants = cva('', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: 'px-4 sm:px-6 xl:px-20',
      nav: 'px-8 sm:px-10 xl:px-6'
    }
  }
})

interface ContainerProps extends SlotProps, VariantProps<typeof toggleVariants> {
  asChild?: boolean
  className?: string
}

export const Container = ({ asChild, className, variant, ...props }: ContainerProps) => {
  const Comp = asChild ? Root : 'section'

  return <Comp className={cn('container mx-auto max-w-7xl', toggleVariants({ variant }), className)} {...props} />
}
