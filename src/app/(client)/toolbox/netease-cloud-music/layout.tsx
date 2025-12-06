import { Metadata } from 'next'

import { toolGroup } from '../utils'

const { description, title } = toolGroup.find(group => group.id == 'tool')!.children.find(tool => tool.id == 'netease-cloud-music')!

export const metadata: Metadata = {
  description,
  title
}

export default function Layout({ children }: LayoutProps<'/toolbox/netease-cloud-music'>) {
  return <div className="mx-auto flex h-[calc(var(--height-main)-2*var(--py))] max-w-xl flex-col gap-4">{children}</div>
}
