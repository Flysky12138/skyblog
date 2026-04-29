import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cron'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
