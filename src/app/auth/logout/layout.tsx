import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '注销'
}

export default function Layout({ children }: LayoutProps<'/auth/logout'>) {
  return children
}
