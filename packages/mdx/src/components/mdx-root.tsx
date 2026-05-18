import { useRender } from '@repo/ui/base'
import { cn } from '@repo/ui/lib/utils'
import React from 'react'

export function MDXRoot({ className, ...props }: React.ComponentProps<'article'> & useRender.ComponentProps<'article'>) {
  return useRender({
    defaultTagName: 'article',
    props: {
      className: cn('@container max-w-none font-article', '*:first:mt-0 *:last:mb-0', className),
      ...props
    },
    state: {
      slot: 'mdx-root'
    }
  })
}
