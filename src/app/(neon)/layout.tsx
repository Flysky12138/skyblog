import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  }
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return children
}
