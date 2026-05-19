import { MDXComponents } from 'next-mdx-remote-client/rsc'

import { custom } from './custom'
import { original } from './original'
import { Wrapper } from './wrapper'

export const components = {
  ...original,
  ...custom,
  wrapper: Wrapper
} satisfies MDXComponents

export type Components = typeof components
export type ComponentsName = keyof Components
export type ComponentsProps = Prettify<Partial<Record<ComponentsName, React.ComponentProps<Components[ComponentsName]>>>>
