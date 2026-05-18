import { useRender } from '@base-ui/react'

import { cn, cva, VariantProps } from '../lib/utils'

const cardVariants = cva('rounded-xl bg-card text-card-foreground shadow-xs', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      button: 'rounded-md border',
      default: 'ring-1 ring-foreground/10 dark:ring-zinc-700'
    }
  }
})

export function Card({ className, render, variant = 'default', ...props }: useRender.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      className: cn(cardVariants({ className, variant })),
      ...props
    },
    state: {
      slot: 'card'
    }
  })
}
