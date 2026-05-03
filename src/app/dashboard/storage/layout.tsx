import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '仓库'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="space-y-3">{children}</div>
}
