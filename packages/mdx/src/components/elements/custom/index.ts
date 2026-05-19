import { MDXComponents } from 'next-mdx-remote-client'

import { Alert } from './alert'
import { Tabs } from './tabs'

export const custom = {
  alert: Alert,
  tabs: Tabs
} satisfies MDXComponents
