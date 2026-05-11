import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '封禁',
    template: '%s | 封禁'
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
