import { useRender } from '@base-ui/react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn, tw } from '@/lib/utils'

const cardVariants = cva(tw`overflow-hidden rounded-xl bg-card text-card-foreground shadow-xs`, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      button: tw`border rounded-md`,
      default: tw`ring-1 ring-foreground/10 dark:ring-zinc-700`
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
