import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '友链'
}

export default function Layout({ children }: LayoutProps<'/friends'>) {
  return <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">{children}</div>
}
