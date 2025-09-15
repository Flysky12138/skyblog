import { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    title: '友链'
  },
  title: '友链',
  twitter: {
    title: '友链'
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">{children}</div>
}
