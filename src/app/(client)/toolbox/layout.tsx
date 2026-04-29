import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '工具箱',
    template: '%s | 工具箱'
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
