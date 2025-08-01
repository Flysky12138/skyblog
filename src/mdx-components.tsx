import { MDXComponents } from 'mdx/types'

import { components } from '@/components/mdx/components'

export const useMDXComponents = (_components: MDXComponents): MDXComponents => ({
  ..._components,
  ...components
})
