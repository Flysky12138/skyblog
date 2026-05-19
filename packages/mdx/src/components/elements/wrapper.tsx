import { useRender } from '@repo/ui/base'
import { cn } from '@repo/ui/lib/utils'
import React from 'react'

export function Wrapper({
  className,
  components,
  ...props
}: {
  /**
   * MDX 注入的参数
   */
  components?: any
} & React.ComponentProps<'article'> &
  useRender.ComponentProps<'article'>) {
  return useRender({
    defaultTagName: 'article',
    props: {
      className: cn('@container max-w-none font-article', '*:first:mt-0 *:last:mb-0', className),
      ...props
    },
    state: {
      slot: 'mdx-wrapper'
    }
  })
}
