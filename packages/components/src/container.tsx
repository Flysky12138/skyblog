import { useRender } from '@repo/ui/base'
import { cn, cva, VariantProps } from '@repo/ui/lib/utils'

const toggleVariants = cva('', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      aside: 'px-8 sm:px-10 xl:px-6',
      default: 'px-3 sm:px-5 xl:px-20'
    }
  }
})

export function Container({ className, render, variant, ...props }: useRender.ComponentProps<'section'> & VariantProps<typeof toggleVariants>) {
  return useRender({
    defaultTagName: 'section',
    render,
    props: {
      'aria-label': 'container',
      className: cn('container mx-auto max-w-7xl', toggleVariants({ className, variant })),
      ...props
    },
    state: {
      slot: 'container'
    }
  })
}
