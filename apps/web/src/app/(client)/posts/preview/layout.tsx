import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Post Preview'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
