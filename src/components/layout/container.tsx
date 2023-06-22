import { cn } from '@/lib/cn'
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

interface ContainerProps extends React.PropsWithChildren, VariantProps<typeof toggleVariants> {
  className?: string
}

export const Container = ({ children, className, variant }: ContainerProps) => {
  return <section className={cn('container mx-auto max-w-7xl', toggleVariants({ variant }), className)}>{children}</section>
}
