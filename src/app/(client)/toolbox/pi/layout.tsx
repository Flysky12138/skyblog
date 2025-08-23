import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PI'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
