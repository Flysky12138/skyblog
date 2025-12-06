import { Root, SlotProps } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'

import { cn, tw } from '@/lib/utils'

const toggleVariants = cva('', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      aside: tw`px-8 sm:px-10 xl:px-6`,
      default: tw`px-3 sm:px-5 xl:px-20`
    }
  }
})

interface ContainerProps extends SlotProps, VariantProps<typeof toggleVariants> {
  asChild?: boolean
  className?: string
}

export function Container({ asChild, className, variant, ...props }: ContainerProps) {
  const Comp = asChild ? Root : 'section'

  return (
    <Comp
      aria-label="container"
      className={cn('container mx-auto max-w-7xl', toggleVariants({ variant }), className)}
      data-slot="container"
      {...props}
    />
  )
}
