import { Metadata } from 'next'

import { toolGroup } from '@/app/(client)/toolbox/utils'

const { description, title } = toolGroup.find(group => group.id == 'develop')!.children.find(tool => tool.id == 'echarts')!

export const metadata: Metadata = {
  description,
  title
}

export default function Layout({ children }: LayoutProps<'/toolbox/echarts'>) {
  return children
}
