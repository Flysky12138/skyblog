import { Metadata } from 'next'

import { toolGroup } from '../utils'

const { description, title } = toolGroup.find(group => group.id == 'other')!.children.find(tool => tool.id == 'pi')!

export const metadata: Metadata = {
  description,
  title
}

export default function Layout({ children }: LayoutProps<'/toolbox/pi'>) {
  return children
}
