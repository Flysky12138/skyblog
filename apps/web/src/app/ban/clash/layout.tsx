import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clash'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
