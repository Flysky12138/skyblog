import { useRender } from '@base-ui/react'
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
