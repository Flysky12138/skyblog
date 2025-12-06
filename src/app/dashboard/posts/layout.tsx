import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文章'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
