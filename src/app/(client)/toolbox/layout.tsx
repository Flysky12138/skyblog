import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '工具箱'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
