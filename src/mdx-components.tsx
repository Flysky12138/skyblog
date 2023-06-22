import { components } from '@/components/mdx/components'
import { MDXComponents } from 'mdx/types'

export const useMDXComponents = (_components: MDXComponents): MDXComponents => {
  return {
    ..._components,
    ...components
  }
}
