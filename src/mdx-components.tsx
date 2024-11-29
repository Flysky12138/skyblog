import { components as _components } from '@/components/mdx/components'
import { MDXComponents } from 'mdx/types'

export const useMDXComponents = (components: MDXComponents): MDXComponents => {
  return {
    ..._components,
    ...components
  }
}
