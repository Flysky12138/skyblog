import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '访客'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
