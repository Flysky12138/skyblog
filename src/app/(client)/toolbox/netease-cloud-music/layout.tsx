import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '云音乐'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
